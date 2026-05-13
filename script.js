const storageKeys = {
  users: "ideond_users",
  session: "ideond_session",
  posts: "ideond_posts",
  follows: "ideond_follows",
  messages: "ideond_messages"
};

const demoUser = {
  id: "user-demo",
  name: "Deniz Yılmaz",
  field: "Bilgisayar Programcılığı",
  email: "demo@ideond.local",
  password: "demo123",
  bio: "Önlisans düzeyinde yazılım, veri analizi ve akademik üretim üzerine çalışmalar paylaşıyor."
};

const demoUsers = [
  demoUser,
  {
    id: "user-ayse",
    name: "Ayşe Kaya",
    field: "Girişimcilik",
    email: "ayse@ideond.local",
    password: "demo123",
    bio: "Yerel işletmeler, dijital görünürlük ve saha araştırmaları üzerine kısa notlar paylaşıyor."
  },
  {
    id: "user-mert",
    name: "Mert Arslan",
    field: "Veri Analizi",
    email: "mert@ideond.local",
    password: "demo123",
    bio: "Veri görselleştirme, okunabilir grafikler ve karar destek panoları üzerine çalışıyor."
  },
  
  {
   id:"user-hasan",
    name: "Hasan Çoruk",
    field: "Akademisyen",
    email: "beun@ideond.local",
    password: "demo123",
    bio: "Akademisyen"
  
    {,
    
    
     
      
];

const demoPosts = [
  {
    id: "post-demo-1",
    authorId: "user-demo",
    title: "Yapay Zeka Destekli Ders Takip Sistemi Tasarımı",
    category: "Yazılım",
    summary: "Bu çalışma, öğrencilerin ders takibi ve ödev planlamasını kolaylaştıran basit bir web arayüzü fikrini ele alır.",
    content: "Projenin amacı, öğrencilerin ders notlarını, teslim tarihlerini ve çalışma hedeflerini tek ekranda görebileceği sade bir sistem tasarlamaktır.\n\nÇalışmada kullanıcı ihtiyaçları belirlenmiş, temel ekran akışı çıkarılmış ve prototipin hangi özellikleri taşıması gerektiği listelenmiştir. İlk aşamada giriş, görev ekleme, ders bazlı filtreleme ve ilerleme takibi gibi bölümler planlanmıştır.\n\nSonuç olarak bu fikir, küçük ekiplerin veya bireysel öğrencilerin hızlıca kullanabileceği, geliştirilebilir bir eğitim teknolojisi prototipi olarak değerlendirilebilir.",
    createdAt: "2026-04-29T09:30:00.000Z"
  },
  {
    id: "post-demo-2",
    authorId: "user-ayse",
    title: "Yerel İşletmeler İçin Dijital Görünürlük Notları",
    category: "Girişimcilik",
    summary: "Küçük işletmelerin dijital ortamda güven veren bir profil oluşturması için uygulanabilir öneriler.",
    content: "Yerel işletmelerin dijital dünyada görünür olması yalnızca sosyal medya hesabı açmakla sınırlı değildir. Düzenli içerik, açık iletişim bilgileri, müşteri yorumları ve güncel çalışma saatleri güven algısını doğrudan etkiler.\n\nBu yazıda temel bir dijital varlık kontrol listesi önerilmiştir. İşletme adı, hizmet açıklaması, görsel kalite, yanıt süresi ve basit kampanya duyuruları bu listenin ana başlıklarını oluşturur.\n\nDüzenli ve anlaşılır bir dijital profil, küçük işletmelerin müşteriyle ilk temasını güçlendirir.",
    createdAt: "2026-04-27T13:15:00.000Z"
  },
  {
    id: "post-demo-3",
    authorId: "user-mert",
    title: "Veri Görselleştirmede Okunabilirlik İlkeleri",
    category: "Veri Analizi",
    summary: "Grafik seçimi, renk kullanımı ve açıklayıcı başlıklarla daha anlaşılır veri sunumları hazırlama üzerine kısa notlar.",
    content: "Veri görselleştirme, yalnızca güzel grafik üretmek değil, verinin doğru anlaşılmasını sağlamaktır. Bu nedenle grafik türü verinin yapısına uygun seçilmelidir.\n\nKarşılaştırma yapılacaksa çubuk grafikler, zamana bağlı değişim gösterilecekse çizgi grafikler daha anlaşılır olabilir. Renk sayısının sınırlı tutulması ve eksenlerin açık biçimde etiketlenmesi okuyucunun grafiği hızlı kavramasına yardım eder.\n\nBaşarılı bir görselleştirme, okuyucunun önce ana mesajı sonra ayrıntıları görebildiği dengeli bir sunum oluşturur.",
    createdAt: "2026-04-25T18:40:00.000Z"
  }
];

const pageIds = {
  feed: "feedPage",
  write: "writePage",
  search: "searchPage",
  dm: "dmPage",
  profile: "profilePage",
  detail: "detailPage"
};

let selectedPostId = null;
let searchTerm = "";
let activeDmUserId = null;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function ensureSeedData() {
  const users = readJson(storageKeys.users, []);
  const posts = readJson(storageKeys.posts, []);
  const mergedUsers = [...users];
  const mergedPosts = [...posts];

  demoUsers.forEach((demo) => {
    if (!mergedUsers.some((user) => user.id === demo.id || user.email === demo.email)) {
      mergedUsers.push(demo);
    }
  });

  demoPosts.forEach((demoPost) => {
    const existingPost = mergedPosts.find((post) => post.id === demoPost.id);
    if (existingPost) {
      Object.assign(existingPost, demoPost);
      hydratePost(existingPost);
    } else {
      hydratePost(demoPost);
      mergedPosts.push(demoPost);
    }
  });

  mergedPosts.forEach(hydratePost);

  writeJson(storageKeys.users, mergedUsers);
  writeJson(storageKeys.posts, mergedPosts);
}

function getUsers() {
  return readJson(storageKeys.users, []);
}

function getPosts() {
  return readJson(storageKeys.posts, []).map(hydratePost).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function savePosts(posts) {
  writeJson(storageKeys.posts, posts.map(hydratePost));
}

function hydratePost(post) {
  post.comments = Array.isArray(post.comments) ? post.comments : [];
  post.shares = Number(post.shares || 0);
  return post;
}

function getFollows() {
  return readJson(storageKeys.follows, {});
}

function getMessages() {
  return readJson(storageKeys.messages, []);
}

function saveMessages(messages) {
  writeJson(storageKeys.messages, messages);
}

function getFollowedIds(userId) {
  return getFollows()[userId] || [];
}

function getSession() {
  return readJson(storageKeys.session, null);
}

function getCurrentUser() {
  const session = getSession();
  if (!session) {
    return null;
  }
  return getUsers().find((user) => user.id === session.userId) || null;
}

function setSession(user) {
  writeJson(storageKeys.session, {
    userId: user.id,
    startedAt: new Date().toISOString()
  });
}

function clearSession() {
  localStorage.removeItem(storageKeys.session);
}

function initials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toLocaleUpperCase("tr-TR");
}

function formatDate(value) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date(value));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setMessage(element, text, type = "") {
  element.textContent = text;
  element.className = `form-message ${type}`.trim();
}

function showAuth() {
  $("#topbar").hidden = true;
  $("#authScreen").hidden = false;
  Object.values(pageIds).forEach((id) => {
    $(`#${id}`).hidden = true;
  });
}

function showAppPage(page) {
  $("#topbar").hidden = false;
  $("#authScreen").hidden = true;

  Object.entries(pageIds).forEach(([pageName, id]) => {
    $(`#${id}`).hidden = pageName !== page;
  });

  $$("[data-nav]").forEach((link) => {
    link.classList.toggle("active", link.dataset.nav === page);
  });
}

function route() {
  const user = getCurrentUser();
  const hash = window.location.hash || "#feed";
  const [page, postId] = hash.replace("#", "").split("/");

  if (!user) {
    showAuth();
    return;
  }

  renderShell(user);

  if (page === "write") {
    showAppPage("write");
    return;
  }

  if (page === "search") {
    renderSearch();
    showAppPage("search");
    return;
  }

  if (page === "dm") {
    activeDmUserId = postId || activeDmUserId || getDefaultDmUser(user)?.id || null;
    renderDm(user);
    showAppPage("dm");
    return;
  }

  if (page === "profile") {
    const profileUser = getUsers().find((item) => item.id === postId) || user;
    renderProfile(profileUser, user);
    showAppPage("profile");
    return;
  }

  if (page === "post" && postId) {
    selectedPostId = postId;
    renderDetail(postId);
    showAppPage("detail");
    return;
  }

  renderFeed(user);
  showAppPage("feed");
}

function renderShell(user) {
  const followedIds = getFollowedIds(user.id);
  $("#miniProfileButton").textContent = initials(user.name);
  $("#profileSummary").dataset.followingCount = String(followedIds.length);
  $("#profileSummary").innerHTML = `
    <div class="profile-card-top"></div>
    <span class="avatar">${escapeHtml(initials(user.name))}</span>
    <h2>${escapeHtml(user.name)}</h2>
    <p class="muted">${escapeHtml(user.field)}</p>
    <div class="stat-row">
      <div class="stat">
        <strong>${getPosts().filter((post) => post.authorId === user.id).length}</strong>
        <span>Yayın</span>
      </div>
      <div class="stat">
        <strong>${getPosts().length}</strong>
        <span>Akış</span>
      </div>
    </div>
  `;
}

function renderFeed() {
  const posts = getPosts();
  $("#postCounter").textContent = `${posts.length} yayın`;
  $("#postList").innerHTML = posts.length
    ? posts.map(renderPostCardInteractive).join("")
    : renderEmptyState("Henüz yayın yok", "İlk yazını paylaşarak akışı başlatabilirsin.");
}

function renderPostCard(post) {
  const author = getUsers().find((user) => user.id === post.authorId) || demoUser;
  return `
    <article class="post-card">
      <div class="post-author">
        <span class="avatar">${escapeHtml(initials(author.name))}</span>
        <div>
          <a class="author-link" href="#profile/${author.id}">${escapeHtml(author.name)}</a>
          <div class="post-meta">
            <span>${escapeHtml(author.field)}</span>
            <span>•</span>
            <span>${formatDate(post.createdAt)}</span>
          </div>
        </div>
      </div>
      <h3>${escapeHtml(post.title)}</h3>
      <div class="post-meta">
        <span class="category-pill">${escapeHtml(post.category)}</span>
      </div>
      <p>${escapeHtml(post.summary)}</p>
      <div class="post-actions">
        <a class="secondary-button" href="#post/${post.id}">Detayı Oku</a>
      </div>
    </article>
  `;
}

function renderPostCardInteractive(post) {
  const author = getUsers().find((user) => user.id === post.authorId) || demoUser;
  const comments = post.comments || [];
  return `
    <article class="post-card" data-post-id="${escapeHtml(post.id)}">
      ${
        post.sharedBy
          ? `<div class="reshare-note">${escapeHtml(getUserName(post.sharedBy))} yeniden paylaştı</div>`
          : ""
      }
      <div class="post-author">
        <span class="avatar">${escapeHtml(initials(author.name))}</span>
        <div>
          <a class="author-link" href="#profile/${author.id}">${escapeHtml(author.name)}</a>
          <div class="post-meta">
            <span>${escapeHtml(author.field)}</span>
            <span>•</span>
            <span>${formatDate(post.createdAt)}</span>
          </div>
        </div>
      </div>
      <h3>${escapeHtml(post.title)}</h3>
      <div class="post-meta">
        <span class="category-pill">${escapeHtml(post.category)}</span>
      </div>
      <p>${escapeHtml(post.summary)}</p>
      <div class="post-actions">
        <a class="secondary-button" href="#post/${post.id}">Detayı Oku</a>
        <button class="secondary-button" type="button" data-action="toggle-comments" data-post-id="${escapeHtml(post.id)}">Yorum ${comments.length}</button>
        <button class="secondary-button" type="button" data-action="share-post" data-post-id="${escapeHtml(post.id)}">Paylaş ${post.shares || 0}</button>
      </div>
      <div class="comment-panel" id="comments-${escapeHtml(post.id)}" hidden>
        <div class="comment-list">
          ${
            comments.length
              ? comments.map(renderComment).join("")
              : `<span class="muted">İlk yorumu sen yaz.</span>`
          }
        </div>
        <form class="comment-form" data-post-id="${escapeHtml(post.id)}">
          <input name="comment" type="text" maxlength="160" placeholder="Yorum yaz">
          <button class="primary-button" type="submit">Gönder</button>
        </form>
      </div>
    </article>
  `;
}

function renderComment(comment) {
  return `
    <div class="comment-item">
      <strong>${escapeHtml(getUserName(comment.userId))}</strong>
      <span>${escapeHtml(comment.text)}</span>
    </div>
  `;
}

function renderEmptyState(title, text) {
  return `
    <div class="empty-state">
      <strong>${escapeHtml(title)}</strong>
      <span>${escapeHtml(text)}</span>
    </div>
  `;
}

function renderProfile(user, viewer = user) {
  const userPosts = getPosts().filter((post) => post.authorId === user.id);
  const isOwnProfile = user.id === viewer.id;
  const followed = isFollowing(viewer.id, user.id);
  $("#profileHero").innerHTML = `
    <div class="profile-cover"></div>
    <div class="profile-body">
      <span class="avatar">${escapeHtml(initials(user.name))}</span>
      <h2>${escapeHtml(user.name)}</h2>
      <p class="muted">${escapeHtml(user.field)}</p>
      <p>${escapeHtml(user.bio || "İdeOnd üzerinde akademik çalışmalarını ve notlarını paylaşıyor.")}</p>
      <div class="profile-tags">
        <span>${userPosts.length} yayın</span>
        <span>${escapeHtml(user.email)}</span>
        <span>Offline demo profil</span>
      </div>
      ${
        isOwnProfile
          ? ""
          : `<div class="profile-actions">
              <button class="primary-button follow-toggle" type="button" id="followProfileButton">${followed ? "Takipten çık" : "Takip et"}</button>
              <a class="secondary-button" href="#dm/${user.id}">Mesaj at</a>
            </div>`
      }
    </div>
  `;
  const followButton = $("#followProfileButton");
  if (followButton) {
    followButton.addEventListener("click", () => {
      toggleFollow(viewer.id, user.id);
      renderShell(viewer);
      renderProfile(user, viewer);
    });
  }
  $("#profilePosts").innerHTML = userPosts.length
    ? userPosts.map(renderPostCardInteractive).join("")
    : renderEmptyState("Yayın arşivin boş", "Makale yaz ekranından ilk çalışmanı paylaşabilirsin.");
}

function isFollowing(viewerId, profileId) {
  return getFollowedIds(viewerId).includes(profileId);
}

function toggleFollow(viewerId, profileId) {
  if (viewerId === profileId) return;
  const follows = getFollows();
  const followedIds = new Set(follows[viewerId] || []);

  if (followedIds.has(profileId)) {
    followedIds.delete(profileId);
  } else {
    followedIds.add(profileId);
  }

  follows[viewerId] = Array.from(followedIds);
  writeJson(storageKeys.follows, follows);
}

function getFollowerCount(userId) {
  return Object.values(getFollows()).filter((ids) => ids.includes(userId)).length;
}

function getUserName(userId) {
  return (getUsers().find((user) => user.id === userId) || demoUser).name;
}

function addComment(postId, text) {
  const user = getCurrentUser();
  if (!user || !text.trim()) return;
  const posts = getPosts();
  const post = posts.find((item) => item.id === postId);
  if (!post) return;

  post.comments.push({
    id: `comment-${Date.now()}`,
    userId: user.id,
    text: text.trim(),
    createdAt: new Date().toISOString()
  });
  savePosts(posts);
}

function sharePost(postId) {
  const user = getCurrentUser();
  if (!user) return;
  const posts = getPosts();
  const post = posts.find((item) => item.id === postId);
  if (!post) return;

  post.shares += 1;
  posts.unshift({
    ...post,
    id: `share-${Date.now()}`,
    sharedBy: user.id,
    createdAt: new Date().toISOString(),
    comments: [],
    shares: 0
  });
  savePosts(posts);
}

function renderSearch() {
  const input = $("#searchInput");
  if (input && input.value !== searchTerm) {
    input.value = searchTerm;
  }

  renderPopularTopics();
  renderSearchResults();
}

function renderSearchResults() {
  const term = searchTerm.trim().toLocaleLowerCase("tr-TR");
  const results = term
    ? getPosts().filter((post) => {
        const author = getUsers().find((user) => user.id === post.authorId) || demoUser;
        return [post.title, post.category, post.summary, post.content, author.name, author.field]
          .join(" ")
          .toLocaleLowerCase("tr-TR")
          .includes(term);
      })
    : [];

  $("#searchResults").innerHTML = term
    ? results.length
      ? results.map(renderPostCardInteractive).join("")
      : renderEmptyState("Sonuç bulunamadı", "Başka bir yayın, yazar veya konu deneyebilirsin.")
    : renderEmptyState("Aramak için yazmaya başla", "Popüler konulardan birine dokunarak da akışı süzebilirsin.");
}

function renderPopularTopics() {
  const topics = getPopularTopics();
  $("#popularTopics").innerHTML = topics
    .map(
      (topic, index) => `
        <button class="trend-card" type="button" data-topic="${escapeHtml(topic.name)}">
          <span class="trend-context">Türkiye gündeminde · ${index + 1}</span>
          <strong>#${escapeHtml(topic.name.replaceAll(" ", ""))}</strong>
          <span>${topic.posts} yayın · ${topic.authors} yazar</span>
        </button>
      `
    )
    .join("");

  $$("#popularTopics .trend-card").forEach((button) => {
    button.addEventListener("click", () => {
      searchTerm = button.dataset.topic;
      renderSearch();
    });
  });
}

function renderDm(currentUser) {
  const people = getUsers().filter((user) => user.id !== currentUser.id);
  const activeUser = people.find((user) => user.id === activeDmUserId) || people[0];
  activeDmUserId = activeUser?.id || null;

  $("#dmPeople").innerHTML = people
    .map(
      (user) => `
        <button class="dm-person ${user.id === activeDmUserId ? "active" : ""}" type="button" data-dm-user="${escapeHtml(user.id)}">
          <span class="avatar">${escapeHtml(initials(user.name))}</span>
          <span>
            <strong>${escapeHtml(user.name)}</strong>
            <small>${escapeHtml(user.field)}</small>
          </span>
        </button>
      `
    )
    .join("");

  if (!activeUser) {
    $("#dmHeader").innerHTML = "";
    $("#dmThread").innerHTML = renderEmptyState("Mesajlaşacak kişi yok", "Yeni kullanıcılar eklenince burada görünür.");
    $("#dmForm").hidden = true;
    return;
  }

  $("#dmForm").hidden = false;
  $("#dmHeader").innerHTML = `
    <span class="avatar">${escapeHtml(initials(activeUser.name))}</span>
    <div>
      <h2 id="dmTitle">${escapeHtml(activeUser.name)}</h2>
      <p class="muted">${escapeHtml(activeUser.field)}</p>
    </div>
  `;

  const thread = getConversation(currentUser.id, activeUser.id);
  $("#dmThread").innerHTML = thread.length
    ? thread.map((message) => renderMessage(message, currentUser.id)).join("")
    : renderEmptyState("Henüz mesaj yok", "Demo DM başlatmak için aşağıdan kısa bir mesaj yaz.");

  $$("#dmPeople .dm-person").forEach((button) => {
    button.addEventListener("click", () => {
      window.location.hash = `#dm/${button.dataset.dmUser}`;
    });
  });
}

function renderMessage(message, currentUserId) {
  return `
    <div class="dm-message ${message.fromId === currentUserId ? "mine" : ""}">
      <span>${escapeHtml(message.text)}</span>
      <small>${formatDate(message.createdAt)}</small>
    </div>
  `;
}

function getConversation(userId, otherId) {
  return getMessages()
    .filter((message) => [message.fromId, message.toId].includes(userId) && [message.fromId, message.toId].includes(otherId))
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
}

function getDefaultDmUser(currentUser) {
  const followed = getFollowedIds(currentUser.id);
  return getUsers().find((user) => user.id !== currentUser.id && followed.includes(user.id)) || getUsers().find((user) => user.id !== currentUser.id);
}

function sendDm(text) {
  const user = getCurrentUser();
  if (!user || !activeDmUserId || !text.trim()) return;
  const messages = getMessages();
  messages.push({
    id: `dm-${Date.now()}`,
    fromId: user.id,
    toId: activeDmUserId,
    text: text.trim(),
    createdAt: new Date().toISOString()
  });
  saveMessages(messages);
}

function getPopularTopics() {
  const topics = new Map();

  getPosts().forEach((post) => {
    const current = topics.get(post.category) || {
      name: post.category,
      posts: 0,
      authors: new Set(),
      score: 0
    };
    current.posts += 1;
    current.authors.add(post.authorId);
    current.score += post.summary.length + post.content.length / 8;
    topics.set(post.category, current);
  });

  return Array.from(topics.values())
    .map((topic) => ({
      ...topic,
      authors: topic.authors.size
    }))
    .sort((a, b) => b.posts - a.posts || b.score - a.score)
    .slice(0, 6);
}

function renderDetail(postId) {
  const post = getPosts().find((item) => item.id === postId);
  const article = $("#detailArticle");

  if (!post) {
    article.innerHTML = `
      <a class="back-link" href="#feed">← Akışa dön</a>
      ${renderEmptyState("Yayın bulunamadı", "Bu demo yayını silinmiş veya bağlantı hatalı olabilir.")}
    `;
    return;
  }

  const author = getUsers().find((user) => user.id === post.authorId) || demoUser;
  article.innerHTML = `
    <a class="back-link" href="#feed">← Akışa dön</a>
    <h1>${escapeHtml(post.title)}</h1>
    <div class="post-meta">
      <span class="category-pill">${escapeHtml(post.category)}</span>
      <span>${escapeHtml(author.name)}</span>
      <span>•</span>
      <span>${formatDate(post.createdAt)}</span>
    </div>
    <p class="summary">${escapeHtml(post.summary)}</p>
    <div class="content">${escapeHtml(post.content)}</div>
  `;
}

function handleAuthTabs() {
  $$("[data-auth-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.authTab;
      $$("[data-auth-tab]").forEach((item) => {
        const active = item.dataset.authTab === target;
        item.classList.toggle("active", active);
        item.setAttribute("aria-selected", String(active));
      });
      $$("[data-auth-form]").forEach((form) => {
        form.classList.toggle("active", form.dataset.authForm === target);
      });
      setMessage($("#loginMessage"), "");
      setMessage($("#registerMessage"), "");
    });
  });
}

function handleLogin() {
  $("#loginForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email")).trim().toLowerCase();
    const password = String(form.get("password"));
    const user = getUsers().find((item) => item.email.toLowerCase() === email && item.password === password);

    if (!user) {
      setMessage($("#loginMessage"), "E-posta veya şifre hatalı.", "error");
      return;
    }

    setSession(user);
    event.currentTarget.reset();
    window.location.hash = "#feed";
    route();
  });
}

function handleRegister() {
  $("#registerForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name")).trim();
    const field = String(form.get("field")).trim();
    const email = String(form.get("email")).trim().toLowerCase();
    const password = String(form.get("password"));

    if (!name || !field || !email || password.length < 4) {
      setMessage($("#registerMessage"), "Tüm alanları doldur ve en az 4 karakterli şifre kullan.", "error");
      return;
    }

    const users = getUsers();
    if (users.some((user) => user.email.toLowerCase() === email)) {
      setMessage($("#registerMessage"), "Bu e-posta ile kayıtlı bir kullanıcı var.", "error");
      return;
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name,
      field,
      email,
      password,
      bio: `${field} alanında çalışmalarını İdeOnd üzerinden paylaşıyor.`
    };

    writeJson(storageKeys.users, [newUser, ...users]);
    setSession(newUser);
    event.currentTarget.reset();
    window.location.hash = "#feed";
    route();
  });
}

function handlePostForm() {
  $("#postForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const user = getCurrentUser();
    if (!user) {
      showAuth();
      return;
    }

    const form = new FormData(event.currentTarget);
    const title = String(form.get("title")).trim();
    const category = String(form.get("category")).trim();
    const summary = String(form.get("summary")).trim();
    const content = String(form.get("content")).trim();

    if (!title || !category || !summary || !content) {
      setMessage($("#postMessage"), "Yayınlamak için tüm alanları doldur.", "error");
      return;
    }

    const newPost = {
      id: `post-${Date.now()}`,
      authorId: user.id,
      title,
      category,
      summary,
      content,
      createdAt: new Date().toISOString()
    };

    writeJson(storageKeys.posts, [newPost, ...getPosts()]);
    setMessage($("#postMessage"), "Yayın akışa eklendi.", "success");
    event.currentTarget.reset();
    window.location.hash = `#post/${newPost.id}`;
  });
}

function handleLogout() {
  $("#logoutButton").addEventListener("click", () => {
    clearSession();
    window.location.hash = "";
    showAuth();
  });
}

function handleProfileShortcut() {
  $("#miniProfileButton").addEventListener("click", () => {
    window.location.hash = "#profile";
  });
}

function handleSearch() {
  $("#searchInput").addEventListener("input", (event) => {
    searchTerm = event.target.value;
    renderSearch();
  });
}

function handleInteractions() {
  document.addEventListener("click", (event) => {
    const actionButton = event.target.closest("[data-action]");
    if (!actionButton) return;

    const postId = actionButton.dataset.postId;
    if (actionButton.dataset.action === "toggle-comments") {
      const panel = document.getElementById(`comments-${postId}`);
      if (panel) panel.hidden = !panel.hidden;
      return;
    }

    if (actionButton.dataset.action === "share-post") {
      sharePost(postId);
      route();
    }
  });

  document.addEventListener("submit", (event) => {
    const commentForm = event.target.closest(".comment-form");
    if (!commentForm) return;

    event.preventDefault();
    const input = commentForm.elements.comment;
    addComment(commentForm.dataset.postId, input.value);
    input.value = "";
    route();
  });
}

function handleDmForm() {
  $("#dmForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = $("#dmInput");
    sendDm(input.value);
    input.value = "";
    renderDm(getCurrentUser());
  });
}

function boot() {
  ensureSeedData();
  handleAuthTabs();
  handleLogin();
  handleRegister();
  handlePostForm();
  handleLogout();
  handleProfileShortcut();
  handleSearch();
  handleInteractions();
  handleDmForm();
  window.addEventListener("hashchange", route);
  route();
}

boot();
