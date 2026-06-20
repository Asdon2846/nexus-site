// ═══════════════════════════════════════════════
//  NEXUS — User Profile Popup (shared component)
//  Inclure ce script dans toutes les pages Nexus
// ═══════════════════════════════════════════════

(function() {

// ── Inject CSS ──
const style = document.createElement('style');
style.textContent = `
#nxup-overlay {
  position: fixed; inset: 0; z-index: 8000;
  display: none; align-items: center; justify-content: center;
  background: rgba(0,0,0,.65); backdrop-filter: blur(8px);
  animation: nxupFadeIn .2s ease;
}
#nxup-overlay.on { display: flex; }
@keyframes nxupFadeIn { from{opacity:0;} to{opacity:1;} }

#nxup-card {
  width: 340px;
  background: #0d0f1c;
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 40px 100px rgba(0,0,0,.7);
  animation: nxupSlideIn .3s cubic-bezier(.34,1.2,.64,1);
  position: relative;
  font-family: 'Outfit', sans-serif;
  color: #eef0ff;
}
@keyframes nxupSlideIn { from{opacity:0;transform:scale(.9) translateY(20px);} to{opacity:1;transform:scale(1) translateY(0);} }

#nxup-banner {
  height: 90px;
  position: relative;
  overflow: hidden;
}
#nxup-banner-img {
  width: 100%; height: 100%;
  object-fit: cover;
  display: none;
}
#nxup-banner-def {
  width: 100%; height: 100%;
}
#nxup-close {
  position: absolute; top: 10px; right: 10px;
  width: 28px; height: 28px;
  border-radius: 50%;
  background: rgba(0,0,0,.5);
  border: none; color: #eef0ff;
  font-size: 14px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background .2s;
}
#nxup-close:hover { background: rgba(255,61,113,.6); }

#nxup-av-wrap {
  position: absolute;
  bottom: -36px; left: 18px;
  width: 72px; height: 72px;
  border-radius: 50%;
  border: 4px solid #0d0f1c;
  overflow: hidden;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 26px;
}
#nxup-av-wrap img {
  width: 100%; height: 100%;
  object-fit: cover; display: none;
}

#nxup-body { padding: 44px 18px 18px; }

#nxup-name {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 26px; letter-spacing: 2px;
  margin-bottom: 2px;
}
#nxup-handle { font-size: 12px; color: #555878; margin-bottom: 8px; }
#nxup-badges { display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 10px; }
.nxup-badge {
  padding: 2px 9px; border-radius: 20px;
  font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
}
#nxup-bio {
  font-size: 13px; color: #767da0;
  line-height: 1.6; font-weight: 300;
  margin-bottom: 12px; min-height: 16px;
}
#nxup-stats {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 8px; margin-bottom: 14px;
}
.nxup-stat {
  text-align: center; padding: 10px 6px;
  background: #111422; border-radius: 10px;
  border: 1px solid rgba(255,255,255,.06);
}
.nxup-stat-val {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 24px; letter-spacing: 1px; line-height: 1;
  margin-bottom: 2px;
}
.nxup-stat-lbl {
  font-size: 9px; color: #4a4e6a;
  text-transform: uppercase; letter-spacing: 1px;
}
#nxup-actions { display: flex; gap: 8px; }
.nxup-btn {
  flex: 1; padding: 9px;
  border-radius: 10px;
  font-family: 'Outfit', sans-serif;
  font-size: 13px; font-weight: 600;
  cursor: pointer; border: none;
  transition: all .2s;
}
.nxup-btn:hover { transform: translateY(-1px); }
#nxup-status-dot {
  display: inline-block;
  width: 8px; height: 8px;
  border-radius: 50%;
  margin-right: 5px;
  vertical-align: middle;
}
#nxup-joined {
  font-size: 11px; color: #4a4e6a;
  margin-bottom: 12px;
}
`;
document.head.appendChild(style);

// ── Inject HTML ──
const overlay = document.createElement('div');
overlay.id = 'nxup-overlay';
overlay.innerHTML = `
  <div id="nxup-card">
    <div id="nxup-banner">
      <img id="nxup-banner-img" alt="">
      <div id="nxup-banner-def"></div>
      <button id="nxup-close" onclick="NXUserPopup.close()">✕</button>
      <div id="nxup-av-wrap">
        <img id="nxup-av-img" alt="">
        <span id="nxup-av-letter">?</span>
      </div>
    </div>
    <div id="nxup-body">
      <div id="nxup-name">Utilisateur</div>
      <div id="nxup-handle">@user</div>
      <div id="nxup-badges"></div>
      <div id="nxup-joined"></div>
      <div id="nxup-bio"></div>
      <div id="nxup-stats">
        <div class="nxup-stat"><div class="nxup-stat-val" id="nxup-msgs" style="color:#00e5ff">0</div><div class="nxup-stat-lbl">Messages</div></div>
        <div class="nxup-stat"><div class="nxup-stat-val" id="nxup-wins" style="color:#ff3d71">0</div><div class="nxup-stat-lbl">Victoires</div></div>
        <div class="nxup-stat"><div class="nxup-stat-val" id="nxup-rank" style="color:#00ff9d">#—</div><div class="nxup-stat-lbl">Rang</div></div>
      </div>
      <div id="nxup-actions"></div>
    </div>
  </div>
`;
document.body.appendChild(overlay);

// Close on outside click
overlay.addEventListener('click', e => { if (e.target === overlay) NXUserPopup.close(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') NXUserPopup.close(); });

// ── Color helpers ──
const AV_COLORS = [
  'linear-gradient(135deg,#00e5ff,#7c6aff)',
  'linear-gradient(135deg,#ff3d71,#ffe600)',
  'linear-gradient(135deg,#00ff9d,#00e5ff)',
  'linear-gradient(135deg,#ffe600,#ff3d71)',
  'linear-gradient(135deg,#7c6aff,#ff6aff)',
];
function avCol(n) { let h=0; for (let c of (n||'?')) h=(h*31+c.charCodeAt(0))|0; return AV_COLORS[Math.abs(h)%AV_COLORS.length]; }
function avLet(n) { return (n||'?')[0].toUpperCase(); }

function getSession() {
  try {
    return JSON.parse(
      localStorage.getItem('nexus_session') ||
      sessionStorage.getItem('nexus_session') ||
      localStorage.getItem('nx_s') ||
      sessionStorage.getItem('nx_s') ||
      'null'
    );
  } catch { return null; }
}

// ── Main API ──
window.NXUserPopup = {

  open(pseudo) {
    if (!pseudo) return;
    const db = JSON.parse(localStorage.getItem('nexus_db') || '{"users":[]}');
    const user = db.users.find(u => u.pseudo.toLowerCase() === pseudo.toLowerCase());
    const session = getSession();
    const isMe = session && session.pseudo.toLowerCase() === pseudo.toLowerCase();

    // Get profile data (only available for current user)
    const prof = isMe ? JSON.parse(localStorage.getItem('nexus_profile') || '{}') : {};

    // Build display data
    const name = user?.pseudo || pseudo;
    const role = user?.role || 'user';
    const joined = user?.joined ? new Date(user.joined).toLocaleDateString('fr-FR', {day:'numeric',month:'long',year:'numeric'}) : '—';
    const msgCount = user?.msgCount || 0;
    const gameWins = user?.gameWins || 0;

    // Count messages from chat db
    const chatDB = JSON.parse(localStorage.getItem('nx_chat') || '{}');
    let totalMsgs = msgCount;
    if (chatDB.messages) {
      totalMsgs = Object.values(chatDB.messages).reduce((sum, arr) => {
        return sum + arr.filter(m => m.pseudo?.toLowerCase() === name.toLowerCase()).length;
      }, 0) || msgCount;
    }

    // Rank
    const allUsers = db.users.map(u => {
      const um = Object.values(chatDB.messages||{}).reduce((s,a)=>s+a.filter(m=>m.pseudo?.toLowerCase()===u.pseudo?.toLowerCase()).length,0);
      return { id: u.id, score: um + (u.gameWins||0)*3 };
    }).sort((a,b) => b.score - a.score);
    const rankIdx = allUsers.findIndex(u => u.id === user?.id);
    const rank = rankIdx > -1 ? '#'+(rankIdx+1) : '#—';

    // Status
    const statusColors = { online:'#00ff9d', away:'#ffe600', dnd:'#ff3d71', invisible:'#555878' };
    const statusLabels = { online:'En ligne', away:'Absent', dnd:'Ne pas déranger', invisible:'Invisible' };
    const statusType = isMe ? (prof.statusType || 'online') : 'online';
    const statusColor = statusColors[statusType];
    const statusLabel = statusLabels[statusType];

    // ── Fill UI ──

    // Banner
    const bannerDef = document.getElementById('nxup-banner-def');
    const bannerImg = document.getElementById('nxup-banner-img');
    if (isMe && prof.bannerSrc) {
      bannerImg.src = prof.bannerSrc;
      bannerImg.style.display = 'block';
      bannerDef.style.display = 'none';
    } else if (isMe && prof.bannerColor) {
      bannerDef.style.background = prof.bannerColor;
      bannerDef.style.display = 'block';
      bannerImg.style.display = 'none';
    } else {
      bannerDef.style.background = `linear-gradient(135deg, ${avCol(name).match(/#[0-9a-f]{6}/gi)?.[0]||'#0e0f1a'} 0%, #15172a 100%)`;
      bannerDef.style.display = 'block';
      bannerImg.style.display = 'none';
    }

    // Avatar
    const avWrap = document.getElementById('nxup-av-wrap');
    const avImg = document.getElementById('nxup-av-img');
    const avLetter = document.getElementById('nxup-av-letter');
    const avatarSrc = isMe ? prof.avatarSrc : null;
    avWrap.style.background = avatarSrc ? 'none' : avCol(name);
    if (avatarSrc) {
      avImg.src = avatarSrc;
      avImg.style.display = 'block';
      avLetter.style.display = 'none';
    } else {
      avImg.style.display = 'none';
      avLetter.style.display = 'block';
      avLetter.textContent = avLet(name);
    }

    // Name & handle
    document.getElementById('nxup-name').textContent = name;
    document.getElementById('nxup-handle').innerHTML =
      `<span id="nxup-status-dot" style="background:${statusColor};"></span>@${name.toLowerCase()} · ${statusLabel}`;

    // Badges
    const badges = document.getElementById('nxup-badges');
    let badgeHtml = '';
    if (role === 'admin') {
      badgeHtml += `<span class="nxup-badge" style="background:rgba(255,61,113,.12);color:#ff3d71;border:1px solid rgba(255,61,113,.2);">👑 Admin</span>`;
    }
    if (isMe) {
      badgeHtml += `<span class="nxup-badge" style="background:rgba(0,229,255,.1);color:#00e5ff;border:1px solid rgba(0,229,255,.2);">✨ C'est toi</span>`;
    }
    badgeHtml += `<span class="nxup-badge" style="background:rgba(255,255,255,.04);color:#767da0;border:1px solid rgba(255,255,255,.06);">👤 Membre</span>`;
    badges.innerHTML = badgeHtml;

    // Joined
    document.getElementById('nxup-joined').textContent = `📅 Membre depuis le ${joined}`;

    // Bio
    const bio = isMe ? (prof.bio || '') : '';
    document.getElementById('nxup-bio').textContent = bio || '';
    document.getElementById('nxup-bio').style.display = bio ? 'block' : 'none';

    // Stats
    document.getElementById('nxup-msgs').textContent = totalMsgs;
    document.getElementById('nxup-wins').textContent = gameWins;
    document.getElementById('nxup-rank').textContent = rank;

    // Actions
    const actions = document.getElementById('nxup-actions');
    if (isMe) {
      actions.innerHTML = `
        <button class="nxup-btn" style="background:#fff;color:#070810;" onclick="window.location.href='nexus-profile.html'">✏️ Mon profil</button>
      `;
    } else {
      actions.innerHTML = `
        <button class="nxup-btn" style="background:rgba(0,229,255,.1);color:#00e5ff;border:1px solid rgba(0,229,255,.2);" onclick="NXUserPopup._mention('${name}')">💬 Mentionner</button>
        <button class="nxup-btn" style="background:rgba(255,255,255,.05);color:#767da0;border:1px solid rgba(255,255,255,.06);" onclick="NXUserPopup.close()">Fermer</button>
      `;
    }

    // Show
    overlay.classList.add('on');
    document.body.style.overflow = 'hidden';
  },

  close() {
    overlay.classList.remove('on');
    document.body.style.overflow = '';
  },

  _mention(pseudo) {
    // Insère la mention dans l'input de chat si présent
    const input = document.getElementById('msg-input');
    if (input) {
      input.value += `@${pseudo} `;
      input.focus();
      const sendBtn = document.getElementById('send-btn');
      if (sendBtn) sendBtn.disabled = false;
    }
    NXUserPopup.close();
  }
};

// ── Auto-bind: attache le popup sur tous les éléments .nx-user ──
// Usage : <span class="nx-user" data-pseudo="Luka">Luka</span>
document.addEventListener('click', e => {
  const el = e.target.closest('.nx-user, .msg-author, [data-nx-user]');
  if (!el) return;
  const pseudo = el.dataset.pseudo || el.dataset.nxUser || el.textContent.trim();
  if (pseudo && pseudo.length > 0 && pseudo.length < 30) {
    NXUserPopup.open(pseudo);
  }
});

})();
