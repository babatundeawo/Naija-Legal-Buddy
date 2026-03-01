
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, Search, Mic, Home as HomeIcon, BookOpen, Clock, 
  AlertTriangle, Menu, X, ArrowLeft, Send, CheckCircle, 
  ExternalLink, Scale, FileText, Download, Copy, Globe,
  ChevronRight, Sparkles, Gavel, Scale as ScaleIcon
} from 'lucide-react';
import { AppState, SavedCase, LegalAdvice, Language, DocumentTemplate, ClarificationQuestion } from './types';
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
  
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [templateValues, setTemplateValues] = useState<Record<string, string>>({});
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const userEmail = "tunspiderman@gmail.com";

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

  const handleSelectTemplate = (tmpl: DocumentTemplate) => {
    setSelectedTemplate(tmpl);
    const initialValues: Record<string, string> = {};
    
    // Infer name from email
    const inferredName = userEmail.split('@')[0].split('.')[0];
    const formattedName = inferredName.charAt(0).toUpperCase() + inferredName.slice(1);
    
    tmpl.fields.forEach(field => {
      const lowerField = field.toLowerCase();
      if (lowerField.includes('your name') || lowerField.includes('full name')) {
        initialValues[field] = formattedName;
      }
    });
    
    setTemplateValues(initialValues);
  };

  const handleSaveCase = () => {
    if (!advice) return;
    const firstPart = state.history[0] || "Saved Case";
    const defaultTitle = firstPart.length > 40 ? firstPart.substring(0, 40) + "..." : firstPart;
    
    const userTitle = prompt("Enter a title for this case:", defaultTitle);
    const finalTitle = userTitle || defaultTitle;
    
    saveCase(advice, finalTitle);
  };

  const renderLanguageSelector = () => (
    <div className="flex flex-wrap gap-2 mb-8 justify-center">
      {LANGUAGES.map(lang => (
        <button
          key={lang.name}
          onClick={() => setState(prev => ({ ...prev, language: lang.name }))}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all border touch-target ${
            state.language === lang.name 
            ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-200/50 scale-105' 
            : 'bg-white text-slate-500 border-slate-100 hover:border-emerald-200 shadow-sm'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );

  const renderHome = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-md mx-auto px-6 py-12 pb-40"
    >
      <div className="text-center mb-10">
        <motion.div 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600 rounded-2xl shadow-xl shadow-emerald-200/50 mb-6 text-white"
        >
          <Gavel className="w-8 h-8" />
        </motion.div>
        <h1 className="text-4xl font-display font-bold text-slate-900 mb-3 tracking-tight">Naija Legal Buddy</h1>
        <p className="text-slate-500 font-medium">Your personal legal guide in Nigeria.</p>
      </div>

      {renderLanguageSelector()}

      <div className="relative mb-10">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-slate-400" />
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={state.language === 'English' ? "Describe your situation..." : `Tell me about your situation in ${state.language}...`}
          className="w-full pl-14 pr-14 py-5 bg-white border border-slate-100 rounded-[2rem] shadow-xl shadow-slate-200/50 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-slate-700 placeholder:text-slate-400 font-medium"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button 
          onClick={handleVoice}
          className={`absolute inset-y-0 right-5 flex items-center touch-target transition-colors ${isRecording ? 'text-red-500 animate-pulse' : 'text-slate-400 hover:text-emerald-500'}`}
        >
          <Mic className="w-6 h-6" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-12">
        {CATEGORIES.map((cat, idx) => (
          <motion.button
            key={cat.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => handleSearch(cat.name)}
            className={`flex flex-col items-center justify-center p-5 premium-card border-2 ${cat.color} hover:scale-[1.02] active:scale-95`}
          >
            <div className="p-3 rounded-2xl mb-3 bg-white/80 backdrop-blur-sm shadow-sm">
              {cat.icon}
            </div>
            <span className="text-[10px] font-bold text-slate-800 text-center uppercase tracking-widest">{cat.name.split(' ')[0]}</span>
          </motion.button>
        ))}
      </div>

      <div className="space-y-4">
        <motion.button 
          whileHover={{ x: 5 }}
          onClick={() => setState({ ...state, currentView: 'emergency' })}
          className="w-full flex items-center justify-between p-6 bg-rose-600 rounded-3xl text-white shadow-xl shadow-rose-200/50 group"
        >
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-2xl">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-lg">Emergency Mode</h3>
              <p className="text-rose-100 text-xs">Detained or facing danger?</p>
            </div>
          </div>
          <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </motion.button>

        <motion.button 
          whileHover={{ x: 5 }}
          onClick={() => setState({ ...state, currentView: 'templates' })}
          className="w-full flex items-center justify-between p-6 bg-slate-900 rounded-3xl text-white shadow-xl shadow-slate-200/50 group"
        >
          <div className="flex items-center gap-4">
            <div className="bg-white/10 p-3 rounded-2xl">
              <FileText className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-lg">Document Library</h3>
              <p className="text-slate-400 text-xs">Rent letters, petitions, etc.</p>
            </div>
          </div>
          <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </div>
    </motion.div>
  );

  const renderTemplates = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-md mx-auto px-6 py-12 pb-40"
    >
      <button 
        onClick={() => { setState({ ...state, currentView: 'home' }); setSelectedTemplate(null); }}
        className="flex items-center text-slate-400 hover:text-slate-800 mb-8 transition-colors font-semibold text-sm"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
      </button>

      {selectedTemplate ? (
        <div className="premium-card p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">{selectedTemplate.name}</h2>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">{selectedTemplate.description}</p>
          
          <div className="space-y-6 mb-10">
            <h3 className="font-bold text-[10px] text-slate-400 uppercase tracking-[0.2em]">Required Information</h3>
            {selectedTemplate.fields.map(field => (
              <div key={field}>
                <label className="block text-[11px] font-bold text-slate-500 mb-2 ml-1 uppercase tracking-wider">{field}</label>
                <input
                  type="text"
                  placeholder={`Enter ${field}...`}
                  value={templateValues[field] || ''}
                  onChange={(e) => setTemplateValues(prev => ({ ...prev, [field]: e.target.value }))}
                  className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm transition-all"
                />
              </div>
            ))}
          </div>

          <div className="bg-stone-50 p-6 rounded-3xl border border-slate-100 mb-10">
            <h3 className="font-bold text-[10px] text-slate-400 uppercase tracking-[0.2em] mb-6">Document Preview</h3>
            <div className="bg-white p-6 rounded-2xl shadow-inner border border-slate-50 max-h-60 overflow-y-auto">
              <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700 leading-relaxed italic">
                {selectedTemplate.fields.reduce(
                  (acc, field) => acc.replace(`{{${field}}}`, templateValues[field] || `[${field}]`),
                  selectedTemplate.content
                ).replace('{{Date}}', new Date().toLocaleDateString())}
              </pre>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                const finalContent = selectedTemplate.fields.reduce(
                  (acc, field) => acc.replace(`{{${field}}}`, templateValues[field] || `[${field}]`),
                  selectedTemplate.content
                ).replace('{{Date}}', new Date().toLocaleDateString());
                navigator.clipboard.writeText(finalContent);
                alert('Document copied to clipboard!');
              }}
              className="w-full bg-emerald-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-emerald-200/50 hover:bg-emerald-700 transition-all"
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
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-slate-200/50 hover:bg-black transition-all"
            >
              <Download className="w-4 h-4" /> Save as Text
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="mb-8">
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">Legal Documents</h2>
            <p className="text-slate-500 text-sm">Professional templates for Nigerian legal situations.</p>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            <button 
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${!selectedCategory ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-100 hover:border-slate-200'}`}
            >
              All
            </button>
            {Array.from(new Set(DOCUMENT_TEMPLATES.map(t => t.category))).map(cat => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${selectedCategory === cat ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200/50' : 'bg-white text-slate-400 border border-slate-100 hover:border-slate-200'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4">
            {DOCUMENT_TEMPLATES
              .filter(t => !selectedCategory || t.category === selectedCategory)
              .map((tmpl, idx) => (
              <motion.button
                key={tmpl.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => handleSelectTemplate(tmpl)}
                className="w-full text-left p-6 premium-card hover:border-emerald-500 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <FileText className="w-12 h-12" />
                </div>
                <div className="relative z-10">
                  <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-[0.2em] bg-emerald-50 px-3 py-1 rounded-full mb-4 inline-block">
                    {tmpl.category}
                  </span>
                  <h3 className="font-bold text-slate-900 mb-2 text-lg">{tmpl.name}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{tmpl.description}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );

  const renderInteraction = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-md mx-auto px-6 py-12 pb-40"
    >
      <button 
        onClick={() => setState({ ...state, currentView: 'home' })}
        className="flex items-center text-slate-400 hover:text-slate-800 mb-8 transition-colors font-semibold text-sm"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </button>

      {state.isSearching ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-emerald-100 rounded-full"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-emerald-600 animate-pulse" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-slate-900 font-bold text-xl mb-2">Analyzing Laws</p>
            <p className="text-slate-400 text-sm animate-pulse">
              {state.language === 'English' ? 'Consulting Nigerian legal frameworks...' : `Checking laws in ${state.language}...`}
            </p>
          </div>
        </div>
      ) : clarification ? (
        <div className="premium-card p-8 animate-in slide-in-from-bottom-8 duration-500">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
            <Search className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-display font-bold text-slate-900 mb-8 leading-tight">{clarification.question}</h2>
          
          <div className="space-y-3 mb-10">
            {clarification.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleClarification(option)}
                className="w-full text-left p-5 rounded-2xl border border-slate-100 bg-slate-50 hover:border-emerald-500 hover:bg-emerald-50 transition-all font-semibold text-slate-700 flex justify-between items-center group touch-target"
              >
                <span>{option}</span>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-transform group-hover:translate-x-1" />
              </button>
            ))}
          </div>

          <div className="pt-8 border-t border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Or provide more details</p>
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your response..."
                className="w-full p-5 pr-16 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm font-medium transition-all"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                onClick={() => handleSearch()}
                className="absolute right-2 top-2 bottom-2 bg-emerald-600 text-white px-4 rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200/50"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : advice ? (
        <div className="space-y-8 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl shadow-slate-300/50 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Shield className="w-24 h-24" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-emerald-500 p-2 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-sm font-bold uppercase tracking-[0.2em]">
                  {state.language === 'English' ? "Legal Guidance" : "Ninu Advice"}
                </h2>
              </div>
              <p className="text-slate-100 leading-relaxed font-medium text-lg">
                {advice.explanation}
              </p>
            </div>
          </motion.div>

          <div className="premium-card p-8">
            <h3 className="font-bold text-slate-900 mb-8 flex items-center uppercase tracking-[0.2em] text-[10px]">
              <Clock className="w-4 h-4 mr-3 text-emerald-500" />
              Actionable Steps
            </h3>
            <div className="space-y-8">
              {advice.steps.map((step, i) => (
                <div key={i} className="flex gap-6">
                  <div className="flex-shrink-0 w-8 h-8 rounded-2xl bg-emerald-50 text-emerald-600 text-xs flex items-center justify-center font-bold border border-emerald-100">
                    {i + 1}
                  </div>
                  <span className="text-slate-600 text-sm leading-relaxed font-medium pt-1">{step}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="premium-card p-8">
            <h3 className="font-bold text-slate-900 mb-8 flex items-center uppercase tracking-[0.2em] text-[10px]">
              <ScaleIcon className="w-4 h-4 mr-3 text-indigo-500" />
              Legal Framework
            </h3>
            <div className="space-y-4">
              {advice.laws.map((law, i) => (
                <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-indigo-200 transition-colors">
                  <p className="font-bold text-slate-900 text-sm mb-1 group-hover:text-indigo-600 transition-colors">{law.title}</p>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{law.section}</p>
                </div>
              ))}
            </div>
          </div>

          {advice.groundingUrls && advice.groundingUrls.length > 0 && (
            <div className="p-6 bg-stone-100 rounded-3xl">
              <p className="text-slate-400 mb-4 font-bold uppercase tracking-[0.2em] text-[9px]">Verified Sources:</p>
              <div className="flex flex-wrap gap-3">
                {advice.groundingUrls.map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="bg-white px-4 py-2 rounded-full text-[10px] font-bold text-emerald-600 border border-slate-100 shadow-sm flex items-center gap-2 hover:scale-105 transition-transform">
                    Source {i + 1} <ExternalLink className="w-3 h-3" />
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="fixed bottom-10 left-6 right-6 flex gap-3 max-w-md mx-auto z-50">
            <button 
              onClick={handleSaveCase}
              className="flex-1 bg-white border border-slate-100 text-slate-900 font-bold py-5 rounded-2xl shadow-2xl flex items-center justify-center gap-3 hover:bg-slate-50 transition-all text-sm touch-target"
            >
              <Clock className="w-5 h-5 text-emerald-600" /> Track Case
            </button>
            <button 
              onClick={() => setState({ ...state, currentView: 'home' })}
              className="bg-emerald-600 text-white font-bold py-5 px-10 rounded-2xl shadow-2xl shadow-emerald-200/50 hover:bg-emerald-700 transition-all text-sm touch-target"
            >
              Finish
            </button>
          </div>
        </div>
      ) : null}
    </motion.div>
  );

  const renderTracker = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-md mx-auto px-6 py-12 pb-40"
    >
      <div className="mb-10">
        <h2 className="text-3xl font-display font-bold text-slate-900 mb-2 flex items-center">
          <Clock className="w-8 h-8 mr-4 text-emerald-600" /> My Tracker
        </h2>
        <p className="text-slate-500 text-sm">Monitor your active legal cases.</p>
      </div>

      {savedCases.length === 0 ? (
        <div className="text-center py-20 premium-card border-dashed border-2 border-slate-100 flex flex-col items-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
            <Clock className="w-8 h-8" />
          </div>
          <p className="text-slate-400 font-medium mb-6">No cases being tracked yet.</p>
          <button 
            onClick={() => setState({ ...state, currentView: 'home' })}
            className="text-emerald-600 font-bold hover:underline flex items-center gap-2"
          >
            Start a new case <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {savedCases.map((c, idx) => (
            <motion.div 
              key={c.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="premium-card p-6 hover:border-emerald-200 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-slate-900 line-clamp-1 flex-1 mr-4 text-lg">{c.title}</h3>
                <span className={`text-[9px] px-3 py-1 rounded-full uppercase font-bold flex-shrink-0 tracking-wider ${
                  c.status === 'resolved' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                }`}>
                  {c.status}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-6">
                <Clock className="w-3 h-3" />
                {new Date(c.timestamp).toLocaleDateString()}
              </div>
              <button 
                onClick={() => {
                  setAdvice(c.advice);
                  setState({ ...state, currentView: 'interaction' });
                }}
                className="w-full bg-slate-50 text-slate-900 font-bold py-3 rounded-xl hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                View Details <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );

  const renderGlossary = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-md mx-auto px-6 py-12 pb-40"
    >
      <div className="mb-10">
        <h2 className="text-3xl font-display font-bold text-slate-900 mb-2 flex items-center">
          <BookOpen className="w-8 h-8 mr-4 text-indigo-600" /> Law Dictionary
        </h2>
        <p className="text-slate-500 text-sm">Simplified legal terminology for Nigerians.</p>
      </div>

      <div className="space-y-4">
        {GLOSSARY.map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="premium-card p-6 hover:border-indigo-100 transition-colors"
          >
            <h3 className="font-bold text-emerald-600 mb-3 text-lg flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {item.term}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed font-medium">{item.definition}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderEmergency = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-md mx-auto px-6 py-12 bg-rose-50 min-h-screen pb-40"
    >
      <button 
        onClick={() => setState({ ...state, currentView: 'home' })}
        className="flex items-center text-rose-600 font-bold mb-10 touch-target"
      >
        <ArrowLeft className="w-5 h-5 mr-2" /> Exit Emergency Mode
      </button>
      
      <div className="bg-rose-600 text-white rounded-[2.5rem] p-10 shadow-2xl shadow-rose-200/50 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-10">
          <AlertTriangle className="w-32 h-32" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-white/20 p-4 rounded-2xl animate-pulse">
              <Shield className="w-8 h-8" />
            </div>
            <h2 className="text-4xl font-display font-bold uppercase tracking-tight">Safe Mode</h2>
          </div>
          <p className="font-medium text-rose-100 mb-10 text-lg leading-relaxed">If you are facing legal trouble right now, follow these steps immediately:</p>
          
          <div className="space-y-6">
            <div className="bg-white/10 p-6 rounded-3xl border border-white/20 backdrop-blur-sm">
              <h4 className="font-bold text-xl mb-2">1. Stay Calm</h4>
              <p className="text-sm text-rose-100 leading-relaxed">Do not argue or struggle physically. This is for your immediate safety.</p>
            </div>
            <div className="bg-white/10 p-6 rounded-3xl border border-white/20 backdrop-blur-sm">
              <h4 className="font-bold text-xl mb-2">2. ID Check</h4>
              <p className="text-sm text-rose-100 leading-relaxed">Show ID if requested. You have the right to remain silent beyond basic identity information.</p>
            </div>
            <div className="bg-white/10 p-6 rounded-3xl border border-white/20 backdrop-blur-sm">
              <h4 className="font-bold text-xl mb-2">3. Privacy Right</h4>
              <p className="text-sm text-rose-100 leading-relaxed">Officers cannot search your phone without a valid warrant. State this politely but firmly.</p>
            </div>
            <div className="bg-rose-900/40 p-6 rounded-3xl border border-rose-400/30 flex items-center justify-between group">
              <div>
                <h4 className="font-bold text-xl mb-1">Legal Aid Line</h4>
                <p className="text-2xl font-display font-bold text-white">0800-53425-243</p>
              </div>
              <div className="bg-white text-rose-600 p-4 rounded-2xl shadow-lg group-active:scale-95 transition-transform">
                <Mic className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40 px-6 py-4">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setState({ ...state, currentView: 'home' })}
          >
            <div className="bg-emerald-600 p-2 rounded-xl text-white shadow-lg shadow-emerald-200/50 group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6" />
            </div>
            <span className="font-display font-bold text-xl text-slate-900 tracking-tight">Buddy</span>
          </div>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-3 text-slate-900 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors touch-target"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      <main className="flex-grow relative">
        <AnimatePresence mode="wait">
          {state.currentView === 'home' && renderHome()}
          {state.currentView === 'interaction' && renderInteraction()}
          {state.currentView === 'tracker' && renderTracker()}
          {state.currentView === 'glossary' && renderGlossary()}
          {state.currentView === 'emergency' && renderEmergency()}
          {state.currentView === 'templates' && renderTemplates()}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 z-50 backdrop-blur-sm" 
              onClick={() => setIsMenuOpen(false)}
            ></motion.div>
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-72 bg-white z-[60] shadow-2xl p-8 flex flex-col"
            >
              <div className="flex justify-between items-center mb-12">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Navigation</h3>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 text-slate-400 hover:text-slate-900 transition-colors"><X className="w-5 h-5" /></button>
              </div>

              <div className="space-y-2 flex-grow">
                {[
                  { id: 'home', label: 'Home', icon: HomeIcon, color: 'text-emerald-600' },
                  { id: 'templates', label: 'Forms Library', icon: FileText, color: 'text-blue-600' },
                  { id: 'tracker', label: 'Case Tracker', icon: Clock, color: 'text-amber-600' },
                  { id: 'glossary', label: 'Glossary', icon: BookOpen, color: 'text-indigo-600' },
                ].map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => { setState({ ...state, currentView: item.id as any }); setIsMenuOpen(false); }}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-bold text-sm ${state.currentView === item.id ? 'bg-slate-50 text-slate-900' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                    <item.icon className={`w-5 h-5 ${item.color}`} /> {item.label}
                  </button>
                ))}
                
                <button 
                  onClick={() => { setState({ ...state, currentView: 'emergency' }); setIsMenuOpen(false); }}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl bg-rose-50 text-rose-600 font-bold text-sm transition-all mt-4"
                >
                  <AlertTriangle className="w-5 h-5" /> Emergency
                </button>
              </div>
              
              <div className="mt-auto pt-8 border-t border-slate-100">
                <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Preferred Language</h3>
                <div className="grid grid-cols-2 gap-2">
                  {LANGUAGES.map(lang => (
                    <button 
                      key={lang.name}
                      onClick={() => setState(prev => ({ ...prev, language: lang.name }))}
                      className={`text-[10px] p-3 rounded-xl border font-bold transition-all ${state.language === lang.name ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-200/50' : 'bg-white text-slate-500 border-slate-100 hover:border-emerald-200'}`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {state.currentView !== 'emergency' && (
        <nav className="fixed bottom-8 left-6 right-6 max-w-md mx-auto z-40">
          <div className="bg-white/80 backdrop-blur-xl border border-white/20 p-3 rounded-[2.5rem] shadow-2xl shadow-slate-300/50 flex items-center justify-around">
            {[
              { id: 'home', icon: HomeIcon, label: 'Home', color: 'emerald' },
              { id: 'templates', icon: FileText, label: 'Forms', color: 'blue' },
              { id: 'tracker', icon: Clock, label: 'Track', color: 'amber' },
              { id: 'glossary', icon: BookOpen, label: 'Gloss', color: 'indigo' },
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => setState({ ...state, currentView: item.id as any })}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-[1.5rem] transition-all relative ${
                  state.currentView === item.id 
                  ? `text-${item.color}-600 scale-110` 
                  : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {state.currentView === item.id && (
                  <motion.div 
                    layoutId="nav-active"
                    className={`absolute inset-0 bg-${item.color}-50 rounded-[1.5rem] -z-10`}
                  />
                )}
                <item.icon className="w-5 h-5" />
                <span className="text-[8px] font-bold uppercase tracking-widest">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
};

export default App;
