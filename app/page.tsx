import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-deep-black text-parchment overflow-hidden relative">
      {/* Animated ravens flying across screen */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="raven-flight">🦅</div>
        <div className="raven-flight" style={{animationDelay: '8s', top: '20%'}}>🦅</div>
        <div className="raven-flight" style={{animationDelay: '15s', top: '60%'}}>🦅</div>
      </div>

      {/* Thunderstorm background */}
      <div className="fixed inset-0 opacity-10">
        <div className="lightning-flash"></div>
        <div className="rain-drops"></div>
      </div>

      {/* Floating spirits */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="spirit-orb" style={{left: '10%', animationDelay: '0s'}}>👻</div>
        <div className="spirit-orb" style={{left: '80%', animationDelay: '3s'}}>🌟</div>
        <div className="spirit-orb" style={{left: '60%', animationDelay: '6s'}}>✨</div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        
        {/* Dramatic entrance animation */}
        <div className="text-center max-w-6xl mx-auto mb-16 entrance-fade">
          
          {/* Ornate gothic border */}
          <div className="gothic-frame p-12 mb-8">
            <div className="skull-decoration mb-6">💀⚰️💀</div>
            
            <h1 className="font-cinzel text-7xl md:text-9xl text-blood-red mb-8 text-shadow-deep typewriter-effect">
              𝕾𝖕𝖊𝖈𝖙𝖊𝖗𝕾𝖈𝖗𝖎𝖕𝖙
            </h1>
            
            <div className="blood-drip-line mb-8"></div>
            
            <p className="font-cinzel text-3xl md:text-4xl text-ember-orange mb-6 glow-pulse">
              ℌ𝔞𝔯𝔳𝔢𝔰𝔱 𝔎𝔫𝔬𝔴𝔩𝔢𝔡𝔤𝔢 𝔣𝔯𝔬𝔪 𝔞 𝔇𝔞𝔯𝔨 ℌ𝔞𝔯𝔳𝔢𝔰𝔱
            </p>
            
            <div className="ancient-scroll-bg p-8 mb-10">
              <p className="font-crimson text-xl md:text-2xl text-parchment leading-relaxed italic">
                "In the depths of forgotten tomes lies wisdom untold...<br/>
                Upload thy cursed PDFs and witness as ancient AI spirits<br/>
                weave comprehensive lesson plans from the very essence of knowledge itself."
              </p>
            </div>

            {/* Dramatic CTA with pulsing effect */}
            <div className="cta-container mb-8">
              <Link 
                href="/generator"
                className="cta-button group relative inline-block"
              >
                <div className="cta-glow"></div>
                <span className="relative z-10 px-16 py-6 font-cinzel text-2xl text-parchment 
                               border-4 border-blood-red rounded-lg bg-charred-grey
                               transition-all duration-500 group-hover:bg-blood-red 
                               group-hover:text-deep-black group-hover:scale-110
                               text-shadow-gothic shadow-2xl">
                  ⚡ 𝔈𝔫𝔱𝔢𝔯 𝔱𝔥𝔢 𝔞𝔟𝔶𝔰𝔰 ⚡
                </span>
              </Link>
            </div>

            <div className="skull-decoration">💀⚰️💀</div>
          </div>
        </div>

        {/* Mystical features with floating cards */}
        <div className="grid md:grid-cols-3 gap-12 max-w-7xl mx-auto mb-20 floating-cards">
          
          <div className="feature-card group">
            <div className="card-glow"></div>
            <div className="relative z-10 bg-charred-grey border-4 border-blood-red rounded-lg p-8 
                          transform transition-all duration-500 group-hover:scale-105 group-hover:rotate-1">
              <div className="text-6xl mb-6 text-center animate-bounce">📜</div>
              <h3 className="font-cinzel text-2xl text-blood-red mb-4 text-center text-shadow-gothic">
                𝔄𝔫𝔠𝔦𝔢𝔫𝔱 𝔗𝔬𝔪𝔢 ℌ𝔞𝔯𝔳𝔢𝔰𝔱
              </h3>
              <p className="font-crimson text-parchment text-center text-lg leading-relaxed">
                Extract the very soul from thy PDF scrolls using forbidden extraction rituals
              </p>
            </div>
          </div>

          <div className="feature-card group" style={{animationDelay: '0.5s'}}>
            <div className="card-glow"></div>
            <div className="relative z-10 bg-charred-grey border-4 border-blood-red rounded-lg p-8 
                          transform transition-all duration-500 group-hover:scale-105 group-hover:rotate-1">
              <div className="text-6xl mb-6 text-center animate-pulse">🧙‍♂️</div>
              <h3 className="font-cinzel text-2xl text-blood-red mb-4 text-center text-shadow-gothic">
                𝔄ℑ 𝔖𝔬𝔯𝔠𝔢𝔯𝔶
              </h3>
              <p className="font-crimson text-parchment text-center text-lg leading-relaxed">
                Summon comprehensive lesson plans through dark AI incantations and mystical algorithms
              </p>
            </div>
          </div>

          <div className="feature-card group" style={{animationDelay: '1s'}}>
            <div className="card-glow"></div>
            <div className="relative z-10 bg-charred-grey border-4 border-blood-red rounded-lg p-8 
                          transform transition-all duration-500 group-hover:scale-105 group-hover:rotate-1">
              <div className="text-6xl mb-6 text-center animate-spin-slow">⚗️</div>
              <h3 className="font-cinzel text-2xl text-blood-red mb-4 text-center text-shadow-gothic">
                𝔄𝔯𝔠𝔞𝔫𝔢 ℌ𝔞𝔯𝔳𝔢𝔰𝔱
              </h3>
              <p className="font-crimson text-parchment text-center text-lg leading-relaxed">
                Manifest thy lesson plans into the mortal realm as Markdown or cursed text scrolls
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Atmospheric candles with realistic flicker */}
      <div className="fixed top-8 left-8 candle-realistic opacity-80">🕯️</div>
      <div className="fixed top-16 right-12 candle-realistic opacity-80" style={{animationDelay: '1.2s'}}>🕯️</div>
      <div className="fixed bottom-12 left-16 candle-realistic opacity-80" style={{animationDelay: '2.4s'}}>🕯️</div>
      <div className="fixed bottom-8 right-8 candle-realistic opacity-80" style={{animationDelay: '0.8s'}}>🕯️</div>
      
      {/* Corner spider webs */}
      <div className="fixed top-0 left-0 text-6xl opacity-30 web-sway">🕸️</div>
      <div className="fixed top-0 right-0 text-6xl opacity-30 web-sway" style={{animationDelay: '2s'}}>🕸️</div>
      <div className="fixed bottom-0 left-0 text-6xl opacity-30 web-sway" style={{animationDelay: '4s'}}>🕸️</div>
      <div className="fixed bottom-0 right-0 text-6xl opacity-30 web-sway" style={{animationDelay: '6s'}}>🕸️</div>

      {/* Mystical fog rolling across bottom */}
      <div className="fixed bottom-0 left-0 w-full h-32 fog-roll opacity-40"></div>
    </div>
  );
}
