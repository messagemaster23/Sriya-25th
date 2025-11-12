import React, { useState, useEffect, useCallback, useRef } from 'react';
import { generateImage, generateCompliment } from './services/geminiService';
import { Card } from './components/Card';
import { SparkleIcon, GiftIcon, StarIcon, HeartIcon, CalendarIcon } from './components/Icons';

// --- Animation Components (no changes needed) ---
const PETAL_COUNT = 30;
const FallingPetals: React.FC<{ duration?: number }> = ({ duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);
  if (!isVisible) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: PETAL_COUNT }).map((_, i) => (
        <div 
          key={i} 
          className="petal" 
          style={{
            left: `${Math.random() * 100}vw`,
            animationDuration: `${Math.random() * 5 + 5}s`,
            animationDelay: `${Math.random() * 5}s`,
            transform: `scale(${Math.random() * 0.5 + 0.5})`,
          }} 
        />
      ))}
    </div>
  );
};
const useOneTimeAnimation = (isActive: boolean) => {
    const [hasAnimated, setHasAnimated] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);
    useEffect(() => {
        if (isActive && !hasAnimated) {
            setHasAnimated(true);
            setShouldRender(true);
            const timer = setTimeout(() => setShouldRender(false), 800); // Animation duration
            return () => clearTimeout(timer);
        }
    }, [isActive, hasAnimated]);
    return shouldRender;
}
const ScrollSparkles: React.FC<{ isActive: boolean; count?: number; className?: string }> = ({ isActive, count = 10, className = '' }) => {
  const shouldRender = useOneTimeAnimation(isActive);
  if (!shouldRender) return null;
  return (
    <div className={`absolute inset-0 w-full h-full pointer-events-none z-10 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i} 
          className="sparkle" 
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 0.5}s`,
          }} 
        />
      ))}
    </div>
  );
};

// --- Main App Component ---
const App: React.FC = () => {
  const sriyaPoem = `An Acrostic for You maa 🤍\n(For Sriya Reddy on her 25th Birthday)\n\nSo bright and kind maa, your smile always makes my day 🤍\nReal happiness follows you everywhere you go ✨\nI feel peace when I think of you and your caring heart 🥺\nYou spread love and calm without even trying 💫\nAnd I always feel lucky to know you maa 😇\n\nReach your dreams bravely maa, you deserve them all 💟\nEvery step you take makes you stronger and happier 🤍\nDay by day you shine more, inside and out 🌸\nDreams and good times are waiting for you ahead 🙏\nYou will always be my blessing, my piggie, my beta, my Devi 💕`;
  const sriyaForecast = `Happy Birthday maa 🤍\n\nAh maa… today your 25th year begins, and I don’t know why but my heart feels full seeing you step into this new year of your life 🥺✨\nYou’ve always been my strength, my peace, my blessing, my piggie 🤍\n\nThis year is yours, maa, your year of light and happiness.\nI just know good things are waiting for you. New moments, new smiles, and new peace are on their way to you, my beta 😇\nMaybe new places, new experiences too — life will surprise you in the best ways this time.\n\nYou’ll grow stronger, calmer, wiser, and even more beautiful inside and out.\nDon’t ever doubt yourself, maa, you’ve already come so far and I’m proud of you always 🥺💫\n\nI wish you so much peace, happiness, and success.\nEvery day, every step, I just wish that Devi amma blesses you and keeps your path clear of pain.\n\nThis 25th year will be special, more laughter, more calm mornings, more reasons to smile.\nI’ll always wish for your happiness, maa… always.\nYou’re my prayer, my light, my little world 🤍\n\nHappy 25th Birthday maa 🤗💟\nLove you always, my piggie, my beta, my everything 💫`;
  const sriyaHistory = `On this day, 25 years ago…\nThe world got a little brighter, maa 🤍\nA small ray of light was born — soft, caring, and full of love.\nSince that day, you’ve been spreading smiles, peace, and warmth everywhere you go.\nYour heart, your laugh, your kindness… they make this world more beautiful.\nYou’re truly one of a kind, maa 🥺💫`;
  const initialCompliment = `Maa 🤍\nYou are a soft light in this noisy world.\nEvery word you speak has calm in it.\nYour smile feels like peace after a long day.\nYour care makes hearts feel safe again.\nYou are strong, brave, kind, and full of love.\n\nI’m always proud of you, maa 🥺💟\nYou’re my blessing, my peace, my Devi.!!`;

  const [imageUrl, setImageUrl] = useState<string>('');
  const [isImageLoading, setIsImageLoading] = useState<boolean>(true);
  const [compliment, setCompliment] = useState<string>(initialCompliment);
  const [isComplimentLoading, setIsComplimentLoading] = useState<boolean>(false);
  const [isInitialCompliment, setIsInitialCompliment] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const imageCardRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const [isImageVisible, setIsImageVisible] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const generatedImageUrl = await generateImage();
        setImageUrl(generatedImageUrl);
      } catch (err) {
        console.error("Failed to fetch initial data:", err);
        setError("Something truly special is being prepared, but it's taking a moment. Please refresh the page.");
      } finally {
        setIsImageLoading(false);
      }
    };
    fetchInitialData();
  }, []);
  
  useEffect(() => {
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.3 };
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsImageVisible(true);
          imageObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);
    if (imageCardRef.current) { imageObserver.observe(imageCardRef.current); }
    const footerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsFooterVisible(true);
          footerObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);
    if (footerRef.current) { footerObserver.observe(footerRef.current); }
    return (). => {
      if (imageCardRef.current) imageObserver.unobserve(imageCardRef.current);
      if (footerRef.current) footerObserver.unobserve(footerRef.current);
    };
  }, [isImageLoading]);

  const handleNewCompliment = useCallback(async () => {
    setIsInitialCompliment(false);
    setIsComplimentLoading(true);
    try {
      const newCompliment = await generateCompliment();
      setCompliment(newCompliment);
    } catch (err) {
      console.error("Failed to fetch compliment:", err);
      setCompliment("You're so amazing, you even broke our compliment generator!");
    } finally {
      setIsComplimentLoading(false);
    }
  }, []);

  const renderAcrosticPoem = (poemText: string) => {
    const lines = poemText.split('\n');
    const titleLines = lines.slice(0, 2);
    const poemLines = lines.slice(2);
    return (
      <div>
        <p className="text-gray-200 font-semibold">{titleLines[0]}</p>
        <p className="text-gray-400 italic text-sm mb-4">{titleLines[1]}</p>
        {poemLines.map((line, index) => {
          if (line.trim() === '') return <div key={index} className="h-4" />;
          const firstLetter = line.charAt(0);
          const restOfLine = line.substring(1);
          return (
            <div key={index} className="flex items-start mb-2 transition-transform duration-300 hover:scale-105">
              <span className="text-pink-400 font-bold text-4xl mr-4 font-serif w-8 text-center">{firstLetter}</span>
              <p className="text-gray-300 leading-relaxed flex-1 pt-2">{restOfLine}</p>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white selection:bg-pink-500 selection:text-white">
      <FallingPetals />
      <div className="absolute inset-0 -z-10 h-full w-full bg-gray-900 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-gray-900 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      <main className="container mx-auto px-4 py-8 md:py-16">
        <header className="text-center mb-12 md:mb-20">
          <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 mb-4 animate-fade-in-down">
            Happy 25th Birthday maa 🤍
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto animate-fade-in-up whitespace-pre-line">
            A beautiful 25 years of you bringing light and love into this world.
            Here’s a small message straight from my heart, just for you 💫
          </p>
        </header>
        {error && <div className="text-center bg-red-900/50 border border-red-700 p-4 rounded-lg"><p>{error}</p></div>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card title="An Acrostic For You" icon={<SparkleIcon />} isLoading={false}>{renderAcrosticPoem(sriyaPoem)}</Card>
          <Card title="Your 25th Year Forecast" icon={<StarIcon />} isLoading={false}><p className="text-gray-300 whitespace-pre-line leading-relaxed">{sriyaForecast}</p></Card>
          <div ref={imageCardRef} className="relative">
            <Card title="A Unique Birthday Card" icon={<GiftIcon />} isLoading={isImageLoading}>{imageUrl && <img src={imageUrl} alt="AI-generated birthday card for Sriya" className="rounded-lg shadow-lg shadow-black/50" />}</Card>
            <ScrollSparkles isActive={isImageVisible} />
          </div>
          <Card title="On This Day, 25 Years Ago..." icon={<CalendarIcon />} isLoading={false}><p className="text-gray-300 whitespace-pre-line leading-relaxed text-lg">{sriyaHistory}</p></Card>
          <div className="md:col-span-2">
             <Card title="A Fountain of Compliments" icon={<HeartIcon />} isLoading={false}>
              <div className="text-center">
                <div className="text-gray-300 text-lg min-h-[56px] flex items-center justify-center mb-6">
                  {isComplimentLoading ? <p className="italic">Thinking of the perfect words...</p> : <p className={`leading-relaxed ${isInitialCompliment ? 'whitespace-pre-line' : 'italic'}`}>{compliment}</p>}
                </div>
                <button onClick={handleNewCompliment} disabled={isComplimentLoading} className="bg-pink-600 hover:bg-pink-700 disabled:bg-pink-800 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 hover:animate-pulse shadow-lg shadow-pink-900/50">
                  {isComplimentLoading ? 'Generating...' : 'Tell Me Something Nice'}
                </button>
              </div>
            </Card>
          </div>
        </div>
        <footer ref={footerRef} className="text-center mt-24 text-gray-500 relative">
          <ScrollSparkles isActive={isFooterVisible} count={15}/>
          <div className="space-y-1">
            <p>With love always, your Bava 💫</p>
            <p>Forever proud of you, maa 🤍✨</p>
          </div>
        </footer>
      </main>
    </div>
  );
};
export default App;
