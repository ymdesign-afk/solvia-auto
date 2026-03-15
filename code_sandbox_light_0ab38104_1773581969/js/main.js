/* =========================================================
   Solviaオート商会 - Main JavaScript
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  // =============================================
  // 1. HEADER - Scroll behavior
  // =============================================
  const header = document.getElementById('header');
  const scrollTopBtn = document.getElementById('scrollTop');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    if (scrollY > 400) {
      scrollTopBtn?.classList.add('visible');
    } else {
      scrollTopBtn?.classList.remove('visible');
    }
  });

  scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  // =============================================
  // 2. HAMBURGER MENU
  // =============================================
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');
  const headerEl = document.getElementById('header');

  function openMenu() {
    hamburger.classList.add('active');
    nav.classList.add('open');
    headerEl.classList.add('nav-is-open');
    document.body.style.overflow = 'hidden';
    headerEl.style.transition = 'none';
    headerEl.style.background = 'transparent';
    headerEl.style.boxShadow = 'none';
    headerEl.style.backdropFilter = 'none';
    headerEl.style.webkitBackdropFilter = 'none';
  }

  function closeMenu() {
    hamburger.classList.remove('active');
    nav.classList.remove('open');
    headerEl.classList.remove('nav-is-open');
    document.body.style.overflow = '';
    headerEl.style.transition = '';
    headerEl.style.background = '';
    headerEl.style.boxShadow = '';
    headerEl.style.backdropFilter = '';
    headerEl.style.webkitBackdropFilter = '';
  }

  hamburger?.addEventListener('click', () => {
    nav.classList.contains('open') ? closeMenu() : openMenu();
  });

  // nav linkをクリックしたら閉じる
  document.querySelectorAll('.nav__link, .nav__btn').forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });


  // =============================================
  // 3. HERO BACKGROUND – PC / SP 切り替え
  // =============================================
  const heroBgImg = document.getElementById('heroBgImg');
  if (heroBgImg) {
    function updateHeroBg() {
      if (window.innerWidth <= 768) {
        heroBgImg.src = 'images/hero-bg-sp.webp';
        heroBgImg.style.objectPosition = '55% calc(50% - 50px)';
      } else {
        heroBgImg.src = 'images/hero-bg-pc.webp';
        heroBgImg.style.objectPosition = 'center 35%';
      }
    }
    updateHeroBg();
    window.addEventListener('resize', updateHeroBg);
  }


  // =============================================
  // 4. AOS – シンプルスクロールアニメーション
  // =============================================
  function initAOS() {
    const elements = document.querySelectorAll('[data-aos]');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.aosDelay || 0);
          setTimeout(() => {
            entry.target.classList.add('aos-animate');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    elements.forEach(el => observer.observe(el));
  }

  initAOS();


  // =============================================
  // 4. SMOOTH SCROLL for anchor links
  // =============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  // =============================================
  // 5. FAQ アコーディオン
  // =============================================
  document.querySelectorAll('.faq__question').forEach(btn => {
    btn.addEventListener('click', function () {
      const isOpen = this.getAttribute('aria-expanded') === 'true';
      // 全部閉じる
      document.querySelectorAll('.faq__question').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        b.nextElementSibling.classList.remove('open');
      });
      // クリックしたものを開く（すでに開いていたら閉じたまま）
      if (!isOpen) {
        this.setAttribute('aria-expanded', 'true');
        this.nextElementSibling.classList.add('open');
      }
    });
  });


  // =============================================
  // 6. CONTACT FORM（Formspree メール送信 + テーブルAPI保存）
  // =============================================
  // ▼ Formspree のエンドポイント
  //   手順: https://formspree.io/ でアカウント作成 →「New Form」→
  //   送信先に svpartners@solviainfo.jp を登録 →
  //   発行される URL（例: https://formspree.io/f/xxxxxxxx）を下記に貼る
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mwvrooqy';

  document.querySelectorAll('.contact-form').forEach(contactForm => {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      // バリデーション：ご相談内容チェックボックスを1つ以上選択
      const checkedTypes = this.querySelectorAll('[name="inquiry_type"]:checked');
      if (checkedTypes.length === 0) {
        alert('ご相談内容を1つ以上お選びください。');
        return;
      }

      const btn = this.querySelector('.form-submit');
      const originalText = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> 送信中...';

      const inquiryTypes = Array.from(checkedTypes).map(cb => cb.value);

      const formData = {
        name:         this.querySelector('[name="name"]').value.trim(),
        kana:         this.querySelector('[name="kana"]')?.value.trim() || '',
        email:        this.querySelector('[name="email"]').value.trim(),
        phone:        this.querySelector('[name="phone"]')?.value.trim() || '',
        inquiry_type: inquiryTypes,
        message:      this.querySelector('[name="message"]').value.trim(),
        submitted_at: new Date().toISOString()
      };

      try {
        // ── (1) Formspree 経由でメール送信 ──
        const formspreeBody = new FormData();
        formspreeBody.append('お名前',         formData.name);
        formspreeBody.append('フリガナ',       formData.kana);
        formspreeBody.append('メールアドレス', formData.email);
        formspreeBody.append('電話番号',       formData.phone);
        formspreeBody.append('ご相談内容',     inquiryTypes.join('、'));
        formspreeBody.append('メッセージ',     formData.message);
        formspreeBody.append('送信日時',       formData.submitted_at);
        formspreeBody.append('_replyto',       formData.email);
        formspreeBody.append('_subject',       `【Solviaオート商会】お問い合わせ：${formData.name} 様`);

        const mailRes = await fetch(FORMSPREE_ENDPOINT, {
          method: 'POST',
          body: formspreeBody,
          headers: { 'Accept': 'application/json' }
        });

        if (!mailRes.ok) throw new Error('メール送信に失敗しました');

        // ── (2) テーブルAPIにも記録保存 ──
        await fetch('tables/contacts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        }).catch(() => {}); // 記録失敗はメール送信成功後なのでスルー

        // ── 成功メッセージ ──
        this.innerHTML = `
          <div class="form-success">
            <div class="form-success__icon"><i class="fa-solid fa-check"></i></div>
            <h3 class="form-success__title">お問い合わせを受け付けました</h3>
            <p class="form-success__text">
              お問い合わせいただき、ありがとうございます。<br />
              内容を確認次第、担当者よりご連絡いたします。<br />
              通常、24時間以内にご返信いたします。
            </p>
          </div>
        `;

      } catch (err) {
        btn.disabled = false;
        btn.innerHTML = originalText;
        alert('送信に失敗しました。お手数ですが、再度お試しください。');
      }
    });
  });


});
