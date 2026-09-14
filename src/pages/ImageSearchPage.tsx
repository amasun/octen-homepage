import React, { useState } from 'react';
import { Search, Newspaper, GraduationCap, Briefcase, Scale, Trophy, Code2, Palette, Plane, Gamepad2, House, CandlestickChart, ArrowUpRight } from 'lucide-react';
import './image-search.css';

const scenarios = [
  ['Legal', Scale], ['Sport', Trophy], ['Code', Code2], ['Design', Palette], ['Travel', Plane],
  ['Academic', GraduationCap], ['Business', Briefcase], ['Game', Gamepad2], ['Real Estate', House], ['Shopping', Newspaper], ['Finance', CandlestickChart], ['News', Newspaper],
] as const;

export const ImageSearchPage: React.FC = () => {
  const [active, setActive] = useState('News');
  return <div className="image-search-page">
    <section className="is-header">
      <div className="is-tag">Vertical Search</div>
      <h1>Search built for every vertical</h1>
      <p>Give every industry the real-time context it needs with search tuned to its<br /> sources, language, and workflows. <strong>News search is live now.</strong></p>
      <button className="is-access">Request Access <ArrowUpRight size={13} /></button>
    </section>
    <section className="is-demo">
      <div className="is-primary-tabs">
        {['Academic', 'News', 'Business'].map((name) => { const Icon = name === 'Academic' ? GraduationCap : name === 'Business' ? Briefcase : Newspaper; return <button key={name} className={active === name ? 'active' : ''} onClick={() => setActive(name)}><Icon size={17} />{name}</button>; })}
      </div>
      <div className="is-gradient-card"><div className="is-search"><Newspaper size={20} /><span>Strait of Hormuz shipping disruptions</span><Search size={20} color="#050505" /></div></div>
    </section>
    <section className="is-more"><h2>More scenarios in future releases</h2><div className="is-scenario-row">{scenarios.map(([name, Icon]) => <div className="is-scenario" key={name}><Icon size={15} />{name}</div>)}</div></section>
  </div>;
};

export default ImageSearchPage;
