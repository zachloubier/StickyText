;
(function ($, window, document) {
  var StickyText = function (elem, settings) {
    this.section = elem;
    this.$section = $(elem);
    this.settings = settings;
    this.text = settings.text;
    this.$text = $(settings.text);
  };

  StickyText.prototype = {
    defaults: {
      bottom: 0,
      top: 0,
      sectionClassActive: 'sticky-section-active',
      textClassActive: 'sticky-text-active'
    },

    init: function () {
      this.config = $.extend(
        {},
        this.defaults,
        this.settings
      );

      this.config.sectionHeight = this.$section.height();
      this.config.textTop = this.$text.position().top;
      this.config.totalTopOffset = this.config.sectionHeight - this.config.bottom - this.config.textTop - this.$text.height();

      this.status = 'before';

      this._bindEvents();

      return this;
    },

    _bindEvents: function() {
      var self        = this,
          resizeTimer = false;

      $(window).scroll(function (e) {
        e.preventDefault();
        self._determineStatus();
        self.positionText();
      });
      $(window).resize(function (e) {
        e.preventDefault();
        clearTimeout(resizeTimer);
        timeout = setTimeout(function() {
          self._determineStatus();
          self.positionText();
        }, 500);
      });
    },

    _calculateTotalTopOffset: function() {
      this.config.totalTopOffset = this.$section.height() - this.config.bottom - this.config.textTop - this.$text.height();
    },

    _determineStatus: function() {
      this._calculateTotalTopOffset();

      var sectionTopOffset = this.$section.offset().top - $(window).scrollTop();

      if (sectionTopOffset <= this.config.top && sectionTopOffset >= -this.config.totalTopOffset) {
        this.status = 'active';
      } else if (sectionTopOffset > 0) {
        this.status = 'before'
      } else if (sectionTopOffset <= -this.config.totalTopOffset) {
        this.status = 'after';
      }
    },

    positionText: function() {
      if (this.status == 'sticky') {
        this.$section.addClass(this.config.sectionClassActive);
        this.$text.addClass(this.config.textClassActive);
        this.$text.css('position', 'fixed');
        this.$text.css('top', this.config.textTop + this.config.top);
        this.$text.css('width', this.$section.width());
      } else if (this.status == 'before') {
        this.$section.removeClass(this.config.sectionClassActive);
        this.$text.removeClass(this.config.textClassActive);
        this.$text.css('position', 'absolute');
        this.$text.css('top', this.config.textTop);
        this.$text.css('width', '100%');
      } else if (this.status == 'after') {
        this.$section.removeClass(this.config.sectionClassActive);
        this.$text.removeClass(this.config.textClassActive);
        this.$text.css('position', 'absolute');
        this.$text.css('top', this.config.totalTopOffset + this.config.textTop + this.config.top);
        this.$text.css('width', '100%');
      }
    }
  };

  StickyText.defaults = StickyText.prototype.defaults;

  $.fn.stickyText = function (options) {
    return this.each(function () {
      new StickyText(this, options).init();
    });
  };
})($j, window, document);

$j(document).ready(function () {
  if ($j('[data-sticky-container]').length && $j('[data-sticky-container] [data-sticky-text]').length) {
    $j('[data-sticky-container]').each(function () {
      var options = $j(this).find('[data-sticky-text]').data('sticky-text');
      options = options ? options : {};
      options.text = $j(this).find('[data-sticky-text]');
      $j(this).stickyText(options);
    })
  }
});