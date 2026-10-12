export default function Bowl({ cfg }) {
  return (
    <div className="bowl" role="img" aria-label="Bowl of makhana">
      {cfg.image ? (
        <img className="product-img" src={cfg.image} alt={cfg.productName} />
      ) : (
        <svg viewBox="0 0 300 260" aria-hidden="true">
          <g fill="#fbf4e2" stroke="#d9c597" strokeWidth="2">
            <circle cx="90" cy="110" r="26" /><circle cx="140" cy="85" r="30" />
            <circle cx="195" cy="100" r="28" /><circle cx="115" cy="140" r="30" />
            <circle cx="170" cy="140" r="30" /><circle cx="215" cy="140" r="24" />
            <circle cx="70" cy="145" r="22" /><circle cx="150" cy="115" r="28" />
          </g>
          <g fill="#9c6b3a">
            <circle cx="135" cy="80" r="2.5" /><circle cx="148" cy="92" r="2" />
            <circle cx="190" cy="98" r="2.5" /><circle cx="112" cy="140" r="2.5" />
            <circle cx="170" cy="145" r="2" /><circle cx="95" cy="110" r="2" />
          </g>
          <path d="M40 150 H260 Q255 230 150 235 Q45 230 40 150Z" fill="#c9b08a" stroke="#a88f68" strokeWidth="2" />
        </svg>
      )}
    </div>
  );
}
