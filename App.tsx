
import React, { useState, useEffect, useRef } from 'react';
import { Shield, Search, Mic, Home as HomeIcon, BookOpen, Clock, AlertTriangle, Menu, X, ArrowLeft, Send, CheckCircle, ExternalLink, Scale, FileText, Download, Copy, Globe } from 'lucide-react';
import { AppState, SavedCase, LegalAdvice, Category, ClarificationQuestion, Language, DocumentTemplate } from './types';
import { CATEGORIES, GLOSSARY, LANGUAGES, DOCUMENT_TEMPLATES } from './constants';
import { analyzeSituation } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    currentView: 'home',
    history: [],
    isSearching: false,
    language: 'English'
  });
  const [input, setInput] = useState('');
  const [advice, setAdvice] = useState<LegalAdvice | null>(null);
  const [clarification, setClarification] = useState<ClarificationQuestion | null>(null);
  const [savedCases, setSavedCases] = useState<SavedCase[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Template Editor state
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [templateValues, setTemplateValues] = useState<Record<string, string>>({});

  useEffect(() => {
    const stored = localStorage.getItem('naija_legal_cases');
    if (stored) {
      setSavedCases(JSON.parse(stored));
    }
  }, []);

  const saveCase = (advice: LegalAdvice, title: string) => {
    const newCase: SavedCase = {
      id: Date.now().toString(),
      title,
      timestamp: Date.now(),
      advice,
      status: 'pending'
    };
    const updated = [newCase, ...savedCases];
    setSavedCases(updated);
    localStorage.setItem('naija_legal_cases', JSON.stringify(updated));
    alert('Case saved to your tracker!');
  };

  const handleSearch = async (query: string = input) => {
    if (!query.trim()) return;
    setState(prev => ({ ...prev, isSearching: true, currentView: 'interaction' }));
    setAdvice(null);
    setClarification(null);

    try {
      const result = await analyzeSituation(query, state.language, state.history);
      if (result.needsClarification) {
        setClarification(result.needsClarification);
      } else if (result.advice) {
        setAdvice(result.advice);
      }
      setState(prev => ({ ...prev, history: [...prev.history, query], isSearching: false }));
      setInput(''); // Clear input after search
    } catch (err) {
      alert("Something went wrong. Please check your internet connection.");
      setState(prev => ({ ...prev, isSearching: false, currentView: 'home' }));
    }
  };

  const handleClarification = (option: string) => {
    handleSearch(`${clarification?.question}: ${option}`);
  };

  const handleVoice = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    const recognition = new (window as any).webkitSpeechRecognition();
    
    const langMap: Record<Language, string> = {
      'English': 'en-NG',
      'Pidgin': 'en-NG',
      'Yoruba': 'yo-NG',
      'Igbo': 'ig-NG',
      'Hausa': 'ha-NG'
    };
    recognition.lang = langMap[state.language] || 'en-NG';
    
    recognition.onstart = () => setIsRecording(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      handleSearch(transcript);
    };
    recognition.onend = () => setIsRecording(false);
    recognition.start();
  };

  const renderLanguageSelector = () => (
    <div className="flex flex-wrap gap-2 mb-6 justify-center">
      {LANGUAGES.map(lang => (
        <button
          key={lang.name}
          onClick={() => setState(prev => ({ ...prev, language: lang.name }))}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
            state.language === lang.name 
            ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm scale-105' 
            : 'bg-white text-slate-500 border-slate-200 hover:border-emerald-200'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );

  const renderHome = () => (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-36">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">How can I help you?</h1>
        <p className="text-slate-500">Legal guidance in your local language.</p>
      </div>

      {renderLanguageSelector()}

      <div className="relative mb-8 group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-slate-400" />
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={state.language === 'English' ? "Type your situation..." : `Tell me about your situation in ${state.language}...`}
          className="w-full pl-12 pr-12 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button 
          onClick={handleVoice}
          className={`absolute inset-y-0 right-4 flex items-center transition-colors ${isRecording ? 'text-red-500 animate-pulse' : 'text-slate-400 hover:text-emerald-500'}`}
        >
          <Mic className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleSearch(cat.name)}
            className="flex flex-col items-center justify-center p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md hover:border-emerald-200 transition-all group"
          >
            <div className={`p-3 rounded-full mb-3 ${cat.color} group-hover:scale-110 transition-transform`}>
              {cat.icon}
            </div>
            <span className="text-[11px] font-bold text-slate-700 text-center uppercase tracking-tight">{cat.name}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 flex items-start gap-4">
          <div className="bg-emerald-500 p-2 rounded-lg text-white">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-emerald-900 mb-1 text-sm">Emergency?</h3>
            <p className="text-emerald-700 text-xs leading-relaxed">Detained or facing danger?</p>
            <button 
              onClick={() => setState({ ...state, currentView: 'emergency' })}
              className="mt-2 text-emerald-800 font-bold text-xs uppercase tracking-wider underline"
            >
              Emergency Steps &rarr;
            </button>
          </div>
        </div>

        <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 flex items-start gap-4">
          <div className="bg-blue-500 p-2 rounded-lg text-white">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-900 mb-1 text-sm">Need a document?</h3>
            <p className="text-blue-700 text-xs leading-relaxed">Rent letters, petitions, etc.</p>
            <button 
              onClick={() => setState({ ...state, currentView: 'templates' })}
              className="mt-2 text-blue-800 font-bold text-xs uppercase tracking-wider underline"
            >
              Document Library &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTemplates = () => (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-36">
      <button 
        onClick={() => { setState({ ...state, currentView: 'home' }); setSelectedTemplate(null); }}
        className="flex items-center text-slate-500 hover:text-slate-800 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
      </button>

      {selectedTemplate ? (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 animate-in fade-in duration-300">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">{selectedTemplate.name}</h2>
          <p className="text-slate-500 text-sm mb-6">{selectedTemplate.description}</p>
          
          <div className="space-y-4 mb-8">
            <h3 className="font-bold text-xs text-slate-400 uppercase tracking-widest">Fill Details</h3>
            {selectedTemplate.fields.map(field => (
              <div key={field}>
                <label className="block text-xs font-bold text-slate-600 mb-1 ml-1">{field}</label>
                <input
                  type="text"
                  placeholder={`Enter ${field}...`}
                  value={templateValues[field] || ''}
                  onChange={(e) => setTemplateValues(prev => ({ ...prev, [field]: e.target.value }))}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                />
              </div>
            ))}
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-8 overflow-x-auto">
            <h3 className="font-bold text-xs text-slate-400 uppercase tracking-widest mb-4">Preview</h3>
            <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700 leading-relaxed">
              {selectedTemplate.fields.reduce(
                (acc, field) => acc.replace(`{{${field}}}`, templateValues[field] || `[${field}]`),
                selectedTemplate.content
              ).replace('{{Date}}', new Date().toLocaleDateString())}
            </pre>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                const finalContent = selectedTemplate.fields.reduce(
                  (acc, field) => acc.replace(`{{${field}}}`, templateValues[field] || `[${field}]`),
                  selectedTemplate.content
                ).replace('{{Date}}', new Date().toLocaleDateString());
                navigator.clipboard.writeText(finalContent);
                alert('Document copied to clipboard!');
              }}
              className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-md hover:bg-blue-700 transition-all"
            >
              <Copy className="w-4 h-4" /> Copy Content
            </button>
            <button
              onClick={() => {
                const finalContent = selectedTemplate.fields.reduce(
                  (acc, field) => acc.replace(`{{${field}}}`, templateValues[field] || `[${field}]`),
                  selectedTemplate.content
                ).replace('{{Date}}', new Date().toLocaleDateString());
                const blob = new Blob([finalContent], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${selectedTemplate.name.replace(/\s+/g, '_')}.txt`;
                a.click();
              }}
              className="px-6 bg-slate-800 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-md hover:bg-slate-900 transition-all"
            >
              <Download className="w-4 h-4" /> Save TXT
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Legal Documents Generator</h2>
          <p className="text-slate-500 mb-6">Select a category below to browse templates for petitions, letters, and simple contracts.</p>
          <div className="grid grid-cols-1 gap-4">
            {DOCUMENT_TEMPLATES.map(tmpl => (
              <button
                key={tmpl.id}
                onClick={() => {
                  setSelectedTemplate(tmpl);
                  setTemplateValues({});
                }}
                className="w-full text-left p-5 bg-white border border-slate-200 rounded-2xl hover:border-blue-500 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-full mb-2 inline-block">
                      {tmpl.category}
                    </span>
                    <h3 className="font-bold text-slate-800 mb-1">{tmpl.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2">{tmpl.description}</p>
                  </div>
                  <FileText className="text-slate-300 group-hover:text-blue-500 transition-colors ml-4 flex-shrink-0" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderInteraction = () => (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-36">
      <button 
        onClick={() => setState({ ...state, currentView: 'home' })}
        className="flex items-center text-slate-500 hover:text-slate-800 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </button>

      {state.isSearching ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium animate-pulse text-center">
            {state.language === 'English' ? 'Searching Nigerian Law Books...' : `Checking laws in ${state.language}...`}
          </p>
        </div>
      ) : clarification ? (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 animate-in slide-in-from-bottom-4 duration-300">
          <h2 className="text-xl font-bold text-slate-800 mb-6">{clarification.question}</h2>
          
          <div className="space-y-3 mb-8">
            {clarification.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleClarification(option)}
                className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all font-medium text-slate-700 flex justify-between items-center group"
              >
                <span>{option}</span>
                <span className="text-slate-300 group-hover:text-emerald-500 text-lg">&rarr;</span>
              </button>
            ))}
          </div>

          <div className="pt-6 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Or type your own response</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type here..."
                className="flex-1 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                onClick={() => handleSearch()}
                className="bg-emerald-500 text-white p-3 rounded-xl hover:bg-emerald-600 transition-colors shadow-md"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : advice ? (
        <div className="space-y-6 pb-20 animate-in fade-in duration-500">
          <div className="bg-emerald-600 text-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-bold mb-3 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              {state.language === 'English' ? "Guidance Summary" : "Ninu Advice"}
            </h2>
            <p className="text-emerald-50 leading-relaxed text-sm">
              {advice.explanation}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center uppercase tracking-tight text-xs">
              <Clock className="w-4 h-4 mr-2 text-blue-500" />
              Recommended Steps
            </h3>
            <ul className="space-y-4">
              {advice.steps.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs flex items-center justify-center font-bold">
                    {i + 1}
                  </div>
                  <span className="text-slate-600 text-sm leading-relaxed">{step}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center uppercase tracking-tight text-xs">
              <Scale className="w-4 h-4 mr-2 text-indigo-500" />
              Law References
            </h3>
            <div className="space-y-3">
              {advice.laws.map((law, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="font-semibold text-slate-800 text-sm">{law.title}</p>
                  <p className="text-xs text-slate-500">{law.section}</p>
                </div>
              ))}
            </div>
          </div>

          {advice.groundingUrls && advice.groundingUrls.length > 0 && (
            <div className="p-4 bg-slate-100 rounded-xl text-[10px]">
              <p className="text-slate-500 mb-2 font-bold uppercase tracking-tight">Sources Checked:</p>
              <div className="flex flex-wrap gap-2">
                {advice.groundingUrls.map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline flex items-center gap-1">
                    Legal Link {i + 1} <ExternalLink className="w-2 h-2" />
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="fixed bottom-24 left-0 right-0 px-4 flex gap-3 max-w-2xl mx-auto z-20">
            <button 
              onClick={() => saveCase(advice, state.history[0] || "Saved Case")}
              className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 hover:bg-slate-50 transition-all text-sm"
            >
              <Clock className="w-4 h-4" /> Track Case
            </button>
            <button 
              onClick={() => setState({ ...state, currentView: 'home' })}
              className="bg-emerald-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:bg-emerald-600 transition-all text-sm"
            >
              Finish
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );

  const renderTracker = () => (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-36">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
        <Clock className="w-6 h-6 mr-3 text-blue-500" /> My Tracker
      </h2>
      {savedCases.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
          <p className="text-slate-400">No active cases being tracked.</p>
          <button 
            onClick={() => setState({ ...state, currentView: 'home' })}
            className="mt-4 text-emerald-500 font-bold hover:underline"
          >
            Start a new case &rarr;
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {savedCases.map((c) => (
            <div key={c.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-200 transition-all">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-slate-800 line-clamp-1 flex-1 mr-4">{c.title}</h3>
                <span className={`text-[10px] px-2 py-1 rounded-full uppercase font-bold flex-shrink-0 ${
                  c.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {c.status}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mb-4">{new Date(c.timestamp).toLocaleString()}</p>
              <button 
                onClick={() => {
                  setAdvice(c.advice);
                  setState({ ...state, currentView: 'interaction' });
                }}
                className="text-emerald-600 text-sm font-bold hover:underline inline-flex items-center"
              >
                View History <ArrowLeft className="w-3 h-3 ml-1 rotate-180" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderGlossary = () => (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-36">
      <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center">
        <BookOpen className="w-6 h-6 mr-3 text-indigo-500" /> Law Dictionary
      </h2>
      <p className="text-slate-500 mb-6 text-sm">Simple definitions for complex legal terms in Nigeria.</p>
      <div className="space-y-4">
        {GLOSSARY.map((item, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-100 transition-colors">
            <h3 className="font-bold text-emerald-600 mb-1">{item.term}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{item.definition}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEmergency = () => (
    <div className="max-w-2xl mx-auto px-4 py-8 bg-red-50 min-h-screen pb-36">
      <button 
        onClick={() => setState({ ...state, currentView: 'home' })}
        className="flex items-center text-red-600 font-bold mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Exit Emergency Mode
      </button>
      
      <div className="bg-red-600 text-white rounded-2xl p-8 shadow-xl mb-6">
        <div className="flex items-center gap-4 mb-4">
          <AlertTriangle className="w-10 h-10 animate-pulse" />
          <h2 className="text-3xl font-extrabold uppercase tracking-tight">Safe Mode</h2>
        </div>
        <p className="font-medium text-red-100 mb-6">If you are currently facing legal trouble, follow these steps immediately:</p>
        
        <div className="space-y-4">
          <div className="bg-white/10 p-4 rounded-xl border border-white/20">
            <h4 className="font-bold mb-1">1. Stay Calm</h4>
            <p className="text-sm text-red-100">Do not argue or struggle physically. This protects your safety.</p>
          </div>
          <div className="bg-white/10 p-4 rounded-xl border border-white/20">
            <h4 className="font-bold mb-1">2. ID Check</h4>
            <p className="text-sm text-red-100">Show ID if requested. You have the right to remain silent beyond basic ID info.</p>
          </div>
          <div className="bg-white/10 p-4 rounded-xl border border-white/20">
            <h4 className="font-bold mb-1">3. Privacy Right</h4>
            <p className="text-sm text-red-100">Officers CANNOT search your phone without a valid warrant. Politely state this.</p>
          </div>
          <div className="bg-white/10 p-4 rounded-xl border border-white/20">
            <h4 className="font-bold mb-1">4. Legal Aid Line</h4>
            <p className="text-sm text-red-100 font-bold">Call Legal Aid: 0800-53425-243</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 py-3 shadow-sm">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setState({ ...state, currentView: 'home' })}
          >
            <div className="bg-emerald-500 p-1.5 rounded-lg text-white shadow-sm">
              <Shield className="w-6 h-6" />
            </div>
            <span className="font-bold text-slate-800 tracking-tight">Naija Legal Buddy</span>
          </div>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <main className="flex-grow">
        {state.currentView === 'home' && renderHome()}
        {state.currentView === 'interaction' && renderInteraction()}
        {state.currentView === 'tracker' && renderTracker()}
        {state.currentView === 'glossary' && renderGlossary()}
        {state.currentView === 'emergency' && renderEmergency()}
        {state.currentView === 'templates' && renderTemplates()}
      </main>

      {isMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
          <div className="fixed top-0 right-0 h-full w-64 bg-white z-50 shadow-2xl p-6 animate-in slide-in-from-right duration-300">
            <button onClick={() => setIsMenuOpen(false)} className="absolute top-4 right-4 text-slate-400"><X /></button>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Menu</h3>
            <div className="space-y-1">
              <button 
                onClick={() => { setState({ ...state, currentView: 'home' }); setIsMenuOpen(false); }}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-700 font-medium transition-colors"
              >
                <HomeIcon className="w-5 h-5 text-emerald-500" /> Home
              </button>
              <button 
                onClick={() => { setState({ ...state, currentView: 'templates' }); setIsMenuOpen(false); }}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-700 font-medium transition-colors"
              >
                <FileText className="w-5 h-5 text-blue-500" /> Forms Library
              </button>
              <button 
                onClick={() => { setState({ ...state, currentView: 'tracker' }); setIsMenuOpen(false); }}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-700 font-medium transition-colors"
              >
                <Clock className="w-5 h-5 text-orange-500" /> Case Tracker
              </button>
              <button 
                onClick={() => { setState({ ...state, currentView: 'glossary' }); setIsMenuOpen(false); }}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-700 font-medium transition-colors"
              >
                <BookOpen className="w-5 h-5 text-indigo-500" /> Glossary
              </button>
              <button 
                onClick={() => { setState({ ...state, currentView: 'emergency' }); setIsMenuOpen(false); }}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-600 font-bold transition-colors"
              >
                <AlertTriangle className="w-5 h-5" /> Emergency
              </button>
            </div>
            
            <div className="mt-8 pt-8 border-t border-slate-100">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Switch Language</h3>
              <div className="grid grid-cols-1 gap-2">
                {LANGUAGES.map(lang => (
                  <button 
                    key={lang.name}
                    onClick={() => setState(prev => ({ ...prev, language: lang.name }))}
                    className={`text-xs p-3 rounded-xl border text-left font-bold flex items-center justify-between ${state.language === lang.name ? 'bg-emerald-500 text-white border-emerald-500 shadow-md' : 'bg-white text-slate-500 border-slate-200'}`}
                  >
                    {lang.label}
                    {state.language === lang.name && <CheckCircle className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* FIXED NAVIGATION: Elevated to ensure it doesn't block text (complemented by pb-36 padding) */}
      {state.currentView !== 'emergency' && (
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md border border-slate-200 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-8 z-40">
          <button 
            onClick={() => setState({ ...state, currentView: 'home' })}
            className={`flex flex-col items-center gap-1 transition-all ${state.currentView === 'home' ? 'text-emerald-500 scale-110' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <HomeIcon className="w-5 h-5" />
            <span className="text-[9px] font-bold uppercase">Home</span>
          </button>
          <button 
            onClick={() => setState({ ...state, currentView: 'templates' })}
            className={`flex flex-col items-center gap-1 transition-all ${state.currentView === 'templates' ? 'text-blue-500 scale-110' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <FileText className="w-5 h-5" />
            <span className="text-[9px] font-bold uppercase">Forms</span>
          </button>
          <button 
            onClick={() => setState({ ...state, currentView: 'tracker' })}
            className={`flex flex-col items-center gap-1 transition-all ${state.currentView === 'tracker' ? 'text-orange-500 scale-110' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Clock className="w-5 h-5" />
            <span className="text-[9px] font-bold uppercase">Tracker</span>
          </button>
          <button 
            onClick={() => setState({ ...state, currentView: 'glossary' })}
            className={`flex flex-col items-center gap-1 transition-all ${state.currentView === 'glossary' ? 'text-indigo-500 scale-110' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-[9px] font-bold uppercase">Gloss</span>
          </button>
        </nav>
      )}
    </div>
  );
};

export default App;
