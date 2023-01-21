class SlowScroll {
    static ID = 'slow-scroll';

    static SETTINGS = {
        DEFAULT_BEHAVIOUR: 'default-behaviour',
        SCROLL_MULTIPLIER: 'scroll-multiplier'
    };

    static  MIN_DELAY = 50;
    static lastTime = 0;

    static init() {
        Hooks.on('init', () => {
            this.initSettings();

            libWrapper.register(
                this.ID,
                'game.dnd5e.canvas.AbilityTemplate.prototype.activatePreviewListeners',
                function (wrapper, initialLayer) {
                    this._onRotatePlacementWrapped = this._onRotatePlacement;
                    this._onRotatePlacement = function (event) {
                        if(!game.settings.get(SlowScroll.ID, SlowScroll.SETTINGS.DEFAULT_BEHAVIOUR)) {
                            if (event.ctrlKey) event.preventDefault(); // Avoid zooming the browser window
                            event.stopPropagation();
                            
                            const t = Date.now();
                            const multiplier = game.settings.get(SlowScroll.ID, SlowScroll.SETTINGS.SCROLL_MULTIPLIER);
                            if ((t - SlowScroll.lastTime) < SlowScroll.MIN_DELAY * multiplier) return;
            
                            SlowScroll.lastTime = t;
                        }
                        this._onRotatePlacementWrapped(event);
                    }
                    return wrapper(initialLayer);
                },
                'MIXED'
            );
        })
    }

    static initSettings() {
        game.settings.register(this.ID, this.SETTINGS.DEFAULT_BEHAVIOUR, {
            name: `SLOW-SCROLL.settings.${this.SETTINGS.DEFAULT_BEHAVIOUR}.Name`,
            default: true,
            type: Boolean,
            scope: 'client',
            config: true,
            hint: `SLOW-SCROLL.settings.${this.SETTINGS.DEFAULT_BEHAVIOUR}.Hint`,
        });

        game.settings.register(this.ID, this.SETTINGS.SCROLL_MULTIPLIER, {
            name: `SLOW-SCROLL.settings.${this.SETTINGS.SCROLL_MULTIPLIER}.Name`,
            default: 1,
            type: Number,
            scope: 'client',
            range: {
                min: 0.5,
                max: 2,
                step: 0.5
            },
            config: true,
            hint: `SLOW-SCROLL.settings.${this.SETTINGS.SCROLL_MULTIPLIER}.Hint`,
        });
    }
}

SlowScroll.init();

