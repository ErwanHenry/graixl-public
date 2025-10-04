/**
 * 📱 Mobile Enhancements Graixl - Améliorations JavaScript pour Mobile
 * Fonctionnalités tactiles et optimisations d'expérience utilisateur mobile
 */

class GraixlMobileEnhancements {
  constructor() {
    this.isTouch = 'ontouchstart' in window;
    this.isMobile = window.innerWidth <= 768;
    this.isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;
    
    this.initMobileFeatures();
    this.setupEventListeners();
  }

  /**
   * 🚀 Initialiser les fonctionnalités mobile
   */
  initMobileFeatures() {
    if (this.isMobile) {
      this.addMobileNavigation();
      this.optimizeTouchInteractions();
      this.setupSwipeGestures();
      this.improveScrolling();
      this.addPullToRefresh();
      this.setupMobileModals();
    }
    
    if (this.isTouch) {
      this.enhanceDragAndDrop();
      this.addHapticFeedback();
    }
    
    this.setupResponsiveHandlers();
    this.optimizePerformance();
  }

  /**
   * 📱 Ajouter navigation mobile
   */
  addMobileNavigation() {
    if (document.querySelector('.mobile-nav')) return;
    
    const mobileNav = document.createElement('div');
    mobileNav.className = 'mobile-nav';
    mobileNav.innerHTML = `
      <a href="/dashboard-prospection.html" class="mobile-nav-item ${this.isCurrentPage('dashboard') ? 'active' : ''}">
        <div class="mobile-nav-icon">🎯</div>
        <div>Dashboard</div>
      </a>
      <a href="/prospects-pipeline.html" class="mobile-nav-item ${this.isCurrentPage('pipeline') ? 'active' : ''}">
        <div class="mobile-nav-icon">👥</div>
        <div>Pipeline</div>
      </a>
      <a href="/campaign-wizard.html" class="mobile-nav-item ${this.isCurrentPage('wizard') ? 'active' : ''}">
        <div class="mobile-nav-icon">➕</div>
        <div>Campagne</div>
      </a>
      <a href="/analytics-dashboard.html" class="mobile-nav-item ${this.isCurrentPage('analytics') ? 'active' : ''}">
        <div class="mobile-nav-icon">📊</div>
        <div>Analytics</div>
      </a>
    `;
    
    document.body.appendChild(mobileNav);
    
    // Ajuster le padding du body
    document.body.style.paddingBottom = '80px';
  }

  /**
   * 🔄 Optimiser les interactions tactiles
   */
  optimizeTouchInteractions() {
    // Améliorer les clics sur mobile
    this.addTouchOptimization();
    
    // Gérer les doubles taps
    this.setupDoubleTapHandling();
    
    // Optimiser les formulaires
    this.optimizeForms();
    
    // Améliorer les cartes prospect
    this.enhanceProspectCards();
  }

  /**
   * 👆 Améliorer les optimisations tactiles
   */
  addTouchOptimization() {
    // Ajouter des zones de touch plus grandes
    const style = document.createElement('style');
    style.textContent = `
      @media (pointer: coarse) {
        .btn, .action-btn, .chart-btn {
          min-height: 44px;
          min-width: 44px;
          position: relative;
        }
        
        .btn::after, .action-btn::after {
          content: '';
          position: absolute;
          top: -8px;
          left: -8px;
          right: -8px;
          bottom: -8px;
        }
        
        .prospect-card {
          padding: 1rem;
          margin-bottom: 1rem;
        }
        
        .filter-select, .search-box input {
          min-height: 44px;
          font-size: 16px; /* Éviter le zoom sur iOS */
        }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * 👆👆 Gérer les doubles taps
   */
  setupDoubleTapHandling() {
    let lastTouchEnd = 0;
    
    document.addEventListener('touchend', (e) => {
      const now = Date.now();
      
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
        
        // Action spéciale pour double tap sur les cartes
        const prospectCard = e.target.closest('.prospect-card');
        if (prospectCard) {
          const prospectId = prospectCard.dataset.prospectId;
          if (prospectId && typeof viewProspect === 'function') {
            viewProspect(parseInt(prospectId));
          }
        }
      }
      
      lastTouchEnd = now;
    }, false);
  }

  /**
   * 📝 Optimiser les formulaires
   */
  optimizeForms() {
    // Améliorer les inputs pour mobile
    document.querySelectorAll('input, select, textarea').forEach(input => {
      // Éviter le zoom automatique sur iOS
      if (input.type === 'text' || input.type === 'email' || input.type === 'tel') {
        input.style.fontSize = '16px';
      }
      
      // Ajouter autocomplete approprié
      if (input.type === 'email') {
        input.setAttribute('autocomplete', 'email');
      }
      if (input.type === 'tel') {
        input.setAttribute('autocomplete', 'tel');
      }
      
      // Améliorer l'expérience de saisie
      input.addEventListener('focus', () => {
        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    });
  }

  /**
   * 🃏 Améliorer les cartes prospect
   */
  enhanceProspectCards() {
    document.querySelectorAll('.prospect-card').forEach(card => {
      // Ajouter feedback tactile
      card.addEventListener('touchstart', () => {
        card.style.transform = 'scale(0.98)';
        card.style.opacity = '0.8';
      });
      
      card.addEventListener('touchend', () => {
        card.style.transform = '';
        card.style.opacity = '';
      });
      
      card.addEventListener('touchcancel', () => {
        card.style.transform = '';
        card.style.opacity = '';
      });
    });
  }

  /**
   * 👆 Configurer les gestes de balayage
   */
  setupSwipeGestures() {
    let startX, startY, currentX, currentY;
    
    document.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchmove', (e) => {
      if (!startX || !startY) return;
      
      currentX = e.touches[0].clientX;
      currentY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchend', (e) => {
      if (!startX || !startY || !currentX || !currentY) return;
      
      const diffX = startX - currentX;
      const diffY = startY - currentY;
      
      // Swipe horizontal
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) {
          this.handleSwipeLeft();
        } else {
          this.handleSwipeRight();
        }
      }
      
      // Swipe vertical
      if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 50) {
        if (diffY > 0) {
          this.handleSwipeUp();
        } else {
          this.handleSwipeDown();
        }
      }
      
      startX = startY = currentX = currentY = null;
    });
  }

  /**
   * ⬅️ Gérer swipe gauche
   */
  handleSwipeLeft() {
    // Navigation entre les colonnes du Kanban
    if (document.querySelector('.kanban-board')) {
      this.navigateKanbanColumns('next');
    }
  }

  /**
   * ➡️ Gérer swipe droite
   */
  handleSwipeRight() {
    // Navigation entre les colonnes du Kanban
    if (document.querySelector('.kanban-board')) {
      this.navigateKanbanColumns('prev');
    }
  }

  /**
   * ⬆️ Gérer swipe haut
   */
  handleSwipeUp() {
    // Masquer la navigation mobile temporairement
    const mobileNav = document.querySelector('.mobile-nav');
    if (mobileNav) {
      mobileNav.style.transform = 'translateY(100%)';
      setTimeout(() => {
        mobileNav.style.transform = '';
      }, 3000);
    }
  }

  /**
   * ⬇️ Gérer swipe bas
   */
  handleSwipeDown() {
    // Afficher la navigation mobile
    const mobileNav = document.querySelector('.mobile-nav');
    if (mobileNav) {
      mobileNav.style.transform = '';
    }
  }

  /**
   * 🔄 Navigation Kanban sur mobile
   */
  navigateKanbanColumns(direction) {
    const columns = document.querySelectorAll('.kanban-column');
    const currentVisible = this.getCurrentVisibleColumn();
    
    let nextIndex;
    if (direction === 'next') {
      nextIndex = (currentVisible + 1) % columns.length;
    } else {
      nextIndex = (currentVisible - 1 + columns.length) % columns.length;
    }
    
    columns[nextIndex].scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'center'
    });
  }

  /**
   * 📊 Améliorer le scrolling
   */
  improveScrolling() {
    // Smooth scrolling pour iOS
    const style = document.createElement('style');
    style.textContent = `
      * {
        -webkit-overflow-scrolling: touch;
      }
      
      .kanban-board {
        scroll-snap-type: x mandatory;
      }
      
      .kanban-column {
        scroll-snap-align: start;
      }
      
      @media (max-width: 768px) {
        .kanban-board {
          overflow-x: auto;
          display: flex;
          gap: 1rem;
          padding: 1rem;
        }
        
        .kanban-column {
          min-width: 280px;
          flex-shrink: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * 🔄 Ajouter Pull to Refresh
   */
  addPullToRefresh() {
    let startY = 0;
    let currentY = 0;
    let isRefreshing = false;
    
    const createRefreshIndicator = () => {
      const indicator = document.createElement('div');
      indicator.className = 'pull-refresh-indicator';
      indicator.innerHTML = '🔄 Tirer pour actualiser';
      indicator.style.cssText = `
        position: fixed;
        top: -60px;
        left: 50%;
        transform: translateX(-50%);
        background: white;
        padding: 10px 20px;
        border-radius: 20px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        z-index: 1000;
        transition: top 0.3s ease;
        font-size: 14px;
        color: #667eea;
      `;
      document.body.appendChild(indicator);
      return indicator;
    };
    
    const indicator = createRefreshIndicator();
    
    document.addEventListener('touchstart', (e) => {
      if (window.scrollY === 0) {
        startY = e.touches[0].clientY;
      }
    });
    
    document.addEventListener('touchmove', (e) => {
      if (window.scrollY === 0 && startY) {
        currentY = e.touches[0].clientY;
        const diffY = currentY - startY;
        
        if (diffY > 0 && diffY < 100) {
          e.preventDefault();
          indicator.style.top = `${Math.min(20, diffY - 40)}px`;
          indicator.innerHTML = diffY > 60 ? '🔄 Relâcher pour actualiser' : '🔄 Tirer pour actualiser';
        }
      }
    });
    
    document.addEventListener('touchend', () => {
      if (startY && currentY) {
        const diffY = currentY - startY;
        
        if (diffY > 60 && !isRefreshing) {
          isRefreshing = true;
          indicator.style.top = '20px';
          indicator.innerHTML = '🔄 Actualisation...';
          
          // Déclencher le refresh
          setTimeout(() => {
            if (typeof refreshData === 'function') {
              refreshData();
            } else {
              window.location.reload();
            }
            
            indicator.style.top = '-60px';
            isRefreshing = false;
          }, 1000);
        } else {
          indicator.style.top = '-60px';
        }
      }
      
      startY = currentY = 0;
    });
  }

  /**
   * 📱 Configurer les modales pour mobile
   */
  setupMobileModals() {
    const modals = document.querySelectorAll('.modal-overlay');
    
    modals.forEach(modal => {
      const modalContent = modal.querySelector('.modal');
      
      // Améliorer la position sur mobile
      modal.style.alignItems = 'flex-end';
      modalContent.style.borderRadius = '20px 20px 0 0';
      modalContent.style.maxHeight = '90vh';
      modalContent.style.width = '100%';
      modalContent.style.margin = '0';
      
      // Ajouter geste de fermeture par swipe
      let startY = 0;
      
      modalContent.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
      });
      
      modalContent.addEventListener('touchmove', (e) => {
        const currentY = e.touches[0].clientY;
        const diffY = currentY - startY;
        
        if (diffY > 0 && diffY < 200) {
          modalContent.style.transform = `translateY(${diffY}px)`;
        }
      });
      
      modalContent.addEventListener('touchend', (e) => {
        const currentY = e.changedTouches[0].clientY;
        const diffY = currentY - startY;
        
        if (diffY > 100) {
          // Fermer la modal
          modal.style.display = 'none';
        }
        
        modalContent.style.transform = '';
      });
    });
  }

  /**
   * 🎯 Améliorer le Drag & Drop
   */
  enhanceDragAndDrop() {
    let draggedElement = null;
    let touchStartTime = 0;
    
    document.addEventListener('touchstart', (e) => {
      const prospectCard = e.target.closest('.prospect-card');
      if (prospectCard) {
        touchStartTime = Date.now();
        
        setTimeout(() => {
          if (Date.now() - touchStartTime >= 500) {
            this.startDragMode(prospectCard, e.touches[0]);
          }
        }, 500);
      }
    });
    
    document.addEventListener('touchmove', (e) => {
      if (draggedElement) {
        e.preventDefault();
        const touch = e.touches[0];
        
        draggedElement.style.position = 'fixed';
        draggedElement.style.left = `${touch.clientX - 50}px`;
        draggedElement.style.top = `${touch.clientY - 50}px`;
        draggedElement.style.zIndex = '1000';
        draggedElement.style.transform = 'scale(1.1)';
        draggedElement.style.opacity = '0.8';
        
        // Highlighter la zone de drop
        const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
        const dropZone = elementBelow?.closest('.kanban-column');
        
        document.querySelectorAll('.kanban-column').forEach(col => {
          col.classList.remove('drag-over');
        });
        
        if (dropZone) {
          dropZone.classList.add('drag-over');
        }
      }
    });
    
    document.addEventListener('touchend', (e) => {
      touchStartTime = 0;
      
      if (draggedElement) {
        const touch = e.changedTouches[0];
        const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
        const dropZone = elementBelow?.closest('.kanban-column');
        
        if (dropZone) {
          const newStatus = dropZone.dataset.status;
          const prospectId = parseInt(draggedElement.dataset.prospectId);
          
          // Mettre à jour le statut
          if (typeof prospects !== 'undefined' && prospectId) {
            const prospect = prospects.find(p => p.id === prospectId);
            if (prospect) {
              prospect.status = newStatus;
              if (typeof loadProspects === 'function') {
                loadProspects();
              }
            }
          }
        }
        
        // Réinitialiser
        draggedElement.style.position = '';
        draggedElement.style.left = '';
        draggedElement.style.top = '';
        draggedElement.style.zIndex = '';
        draggedElement.style.transform = '';
        draggedElement.style.opacity = '';
        
        document.querySelectorAll('.kanban-column').forEach(col => {
          col.classList.remove('drag-over');
        });
        
        draggedElement = null;
      }
    });
  }

  /**
   * 🎯 Démarrer le mode drag
   */
  startDragMode(element, touch) {
    draggedElement = element;
    element.style.transition = 'none';
    
    // Feedback tactile
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    // Créer un clone pour l'aperçu
    const clone = element.cloneNode(true);
    clone.style.position = 'fixed';
    clone.style.left = `${touch.clientX - 50}px`;
    clone.style.top = `${touch.clientY - 50}px`;
    clone.style.width = '200px';
    clone.style.zIndex = '1000';
    clone.style.transform = 'scale(1.1)';
    clone.style.opacity = '0.8';
    clone.style.pointerEvents = 'none';
    
    document.body.appendChild(clone);
    
    setTimeout(() => {
      if (clone.parentNode) {
        clone.parentNode.removeChild(clone);
      }
      element.style.transition = '';
    }, 100);
  }

  /**
   * 📳 Ajouter feedback haptique
   */
  addHapticFeedback() {
    // Feedback pour les actions importantes
    document.addEventListener('click', (e) => {
      if (e.target.matches('.btn-primary, .action-btn')) {
        if (navigator.vibrate) {
          navigator.vibrate(10);
        }
      }
    });
    
    // Feedback pour drag & drop
    document.addEventListener('dragstart', () => {
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    });
    
    document.addEventListener('drop', () => {
      if (navigator.vibrate) {
        navigator.vibrate([30, 10, 30]);
      }
    });
  }

  /**
   * 📱 Configurer les gestionnaires responsives
   */
  setupResponsiveHandlers() {
    // Gérer les changements d'orientation
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.handleOrientationChange();
      }, 100);
    });
    
    // Gérer le redimensionnement
    window.addEventListener('resize', this.debounce(() => {
      this.handleResize();
    }, 250));
    
    // Gérer le zoom
    this.handleViewportZoom();
  }

  /**
   * 🔄 Gérer le changement d'orientation
   */
  handleOrientationChange() {
    // Réajuster les modales
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
      modal.style.maxHeight = '90vh';
    });
    
    // Réajuster le Kanban
    if (window.orientation === 90 || window.orientation === -90) {
      // Mode paysage
      const kanbanBoard = document.querySelector('.kanban-board');
      if (kanbanBoard && this.isMobile) {
        kanbanBoard.style.gridTemplateColumns = 'repeat(3, 1fr)';
      }
    } else {
      // Mode portrait
      const kanbanBoard = document.querySelector('.kanban-board');
      if (kanbanBoard && this.isMobile) {
        kanbanBoard.style.gridTemplateColumns = '1fr';
      }
    }
  }

  /**
   * 📏 Gérer le redimensionnement
   */
  handleResize() {
    this.isMobile = window.innerWidth <= 768;
    this.isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;
    
    // Réinitialiser si nécessaire
    if (this.isMobile && !document.querySelector('.mobile-nav')) {
      this.addMobileNavigation();
    } else if (!this.isMobile && document.querySelector('.mobile-nav')) {
      document.querySelector('.mobile-nav').remove();
      document.body.style.paddingBottom = '';
    }
  }

  /**
   * 🔍 Gérer le zoom du viewport
   */
  handleViewportZoom() {
    // Empêcher le zoom sur double tap pour les éléments spécifiques
    document.addEventListener('touchend', (e) => {
      if (e.target.matches('.btn, .action-btn, .chart-btn')) {
        e.preventDefault();
      }
    });
  }

  /**
   * ⚡ Optimiser les performances
   */
  optimizePerformance() {
    // Lazy loading pour les images
    this.setupLazyLoading();
    
    // Optimiser les scrolls
    this.optimizeScrollPerformance();
    
    // Réduire les repaints
    this.minimizeRepaints();
  }

  /**
   * 🖼️ Configurer le lazy loading
   */
  setupLazyLoading() {
    if ('IntersectionObserver' in window) {
      const lazyImages = document.querySelectorAll('img[data-src]');
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        });
      });
      
      lazyImages.forEach(img => imageObserver.observe(img));
    }
  }

  /**
   * 📜 Optimiser les performances de scroll
   */
  optimizeScrollPerformance() {
    let ticking = false;
    
    const updateScrollPosition = () => {
      // Optimisations basées sur la position de scroll
      const scrollTop = window.pageYOffset;
      
      // Masquer/afficher la navigation mobile
      const mobileNav = document.querySelector('.mobile-nav');
      if (mobileNav) {
        if (scrollTop > 100) {
          mobileNav.style.transform = 'translateY(100%)';
        } else {
          mobileNav.style.transform = '';
        }
      }
      
      ticking = false;
    };
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollPosition);
        ticking = true;
      }
    }, { passive: true });
  }

  /**
   * 🎨 Minimiser les repaints
   */
  minimizeRepaints() {
    // Grouper les changements DOM
    const observer = new MutationObserver((mutations) => {
      let needsUpdate = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' || mutation.type === 'attributes') {
          needsUpdate = true;
        }
      });
      
      if (needsUpdate) {
        requestAnimationFrame(() => {
          // Effectuer les mises à jour groupées
        });
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });
  }

  // Méthodes utilitaires
  
  getCurrentVisibleColumn() {
    const columns = document.querySelectorAll('.kanban-column');
    const viewportCenter = window.innerWidth / 2;
    
    for (let i = 0; i < columns.length; i++) {
      const rect = columns[i].getBoundingClientRect();
      if (rect.left <= viewportCenter && rect.right >= viewportCenter) {
        return i;
      }
    }
    
    return 0;
  }
  
  isCurrentPage(page) {
    const currentPath = window.location.pathname;
    switch(page) {
      case 'dashboard': return currentPath.includes('dashboard-prospection');
      case 'pipeline': return currentPath.includes('prospects-pipeline');
      case 'wizard': return currentPath.includes('campaign-wizard');
      case 'analytics': return currentPath.includes('analytics-dashboard');
      default: return false;
    }
  }
  
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  setupEventListeners() {
    // Écouter les événements personnalisés
    document.addEventListener('graixlRefresh', () => {
      this.handleRefresh();
    });
    
    document.addEventListener('graixlNotification', (e) => {
      this.showMobileNotification(e.detail);
    });
  }
  
  handleRefresh() {
    // Logique de rafraîchissement
    if (typeof loadProspects === 'function') loadProspects();
    if (typeof updateStats === 'function') updateStats();
    if (typeof loadCampaigns === 'function') loadCampaigns();
  }
  
  showMobileNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'mobile-notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #10b981;
      color: white;
      padding: 12px 24px;
      border-radius: 25px;
      z-index: 1001;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: slideDown 0.3s ease;
    `;
    
    // Ajouter l'animation CSS
    if (!document.querySelector('#mobile-notification-styles')) {
      const style = document.createElement('style');
      style.id = 'mobile-notification-styles';
      style.textContent = `
        @keyframes slideDown {
          from { transform: translateX(-50%) translateY(-100%); }
          to { transform: translateX(-50%) translateY(0); }
        }
      `;
      document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideDown 0.3s ease reverse';
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }
}

// Initialiser les améliorations mobile quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
  window.graixlMobile = new GraixlMobileEnhancements();
});

// Exporter pour utilisation dans d'autres scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GraixlMobileEnhancements;
}