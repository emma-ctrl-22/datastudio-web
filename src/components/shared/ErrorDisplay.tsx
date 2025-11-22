import dataThief from '../assets/undraw_data-thief_d66l.png';
import fingerprint from '../assets/undraw_fingerprint_kdwq.png';
import firewall from '../assets/undraw_firewall_cfej.png';
import inviteOnly from '../assets/undraw_invite-only_373f.png';

const errorIllustrations: Record<string, string> = {
  'Invalid user': inviteOnly,
  'Access forbidden: insufficient permissions': firewall,
  'Access denied (no permission defined)': fingerprint,
  'Cannot determine resource for authorization': dataThief,
};

function ErrorDisplay({ error }: { error: string }) {
  const imgSrc = errorIllustrations[error] || dataThief;
  return (
    <div style={{ textAlign: 'center' }}>
      <img src={imgSrc} alt="Error" style={{ maxWidth: 320 }} />
      <h2>{error}</h2>
    </div>
  );
}
export default ErrorDisplay;