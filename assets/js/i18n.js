// Internationalization (i18n) support
(function() {
    'use strict';

    // Translation data - will be populated from Jekyll data files
    var translations = {
        en: {
            nav: {
                projects: "Projects",
                about: "About",
                github: "Github",
                search_placeholder: "Search..."
            },
            home: {
                featured_projects: "Featured Projects",
                all_projects: "All Projects"
            },
            explore: {
                title: "Explore"
            },
            footer: {
                copyright: "Copyright",
                theme_by: "by WowThemes.net"
            },
            search: {
                placeholder: "Search...",
                no_results: "No results found"
            },
            post: {
                summary: "Summary",
                rating: "Rating",
                read_more: "Read More",
                published: "Published",
                last_modified: "Last Modified",
                categories: "Categories",
                tags: "Tags"
            },
            language: {
                select: "Language",
                en: "English",
                zh: "中文"
            }
        },
        zh: {
            nav: {
                projects: "项目",
                about: "关于",
                github: "Github",
                search_placeholder: "搜索..."
            },
            home: {
                featured_projects: "精选项目",
                all_projects: "所有项目"
            },
            explore: {
                title: "探索"
            },
            footer: {
                copyright: "版权所有",
                theme_by: "由 WowThemes.net 提供主题"
            },
            search: {
                placeholder: "搜索...",
                no_results: "未找到结果"
            },
            post: {
                summary: "目录",
                rating: "评分",
                read_more: "阅读更多",
                published: "发布日期",
                last_modified: "最后修改",
                categories: "分类",
                tags: "标签"
            },
            language: {
                select: "语言",
                en: "English",
                zh: "中文"
            }
        }
    };

    var supportedLanguages = ['en', 'zh'];
    var defaultLanguage = 'en';

    // Get nested translation value by dot notation key
    function getTranslation(lang, key) {
        var keys = key.split('.');
        var value = translations[lang];
        for (var i = 0; i < keys.length; i++) {
            if (value && value[keys[i]]) {
                value = value[keys[i]];
            } else {
                return null;
            }
        }
        return value;
    }

    // Detect system language
    function detectSystemLanguage() {
        var lang = navigator.language || navigator.userLanguage || '';
        lang = lang.toLowerCase().split('-')[0]; // Get primary language code (e.g., 'zh' from 'zh-CN')

        if (supportedLanguages.indexOf(lang) !== -1) {
            return lang;
        }
        return defaultLanguage;
    }

    // Get current language from localStorage or detect from system
    function getCurrentLanguage() {
        var stored = localStorage.getItem('site-language');
        if (stored && supportedLanguages.indexOf(stored) !== -1) {
            return stored;
        }
        // First visit - detect system language
        var detected = detectSystemLanguage();
        localStorage.setItem('site-language', detected);
        return detected;
    }

    // Set language
    function setLanguage(lang) {
        if (supportedLanguages.indexOf(lang) === -1) {
            lang = defaultLanguage;
        }
        localStorage.setItem('site-language', lang);
        applyTranslations(lang);
        updateLanguageSelector(lang);
        document.documentElement.lang = lang;
    }

    // Apply translations to all elements with data-i18n attribute
    function applyTranslations(lang) {
        var elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(function(el) {
            var key = el.getAttribute('data-i18n');
            var translation = getTranslation(lang, key);
            if (translation) {
                el.textContent = translation;
            }
        });

        // Handle placeholder translations
        var placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
        placeholderElements.forEach(function(el) {
            var key = el.getAttribute('data-i18n-placeholder');
            var translation = getTranslation(lang, key);
            if (translation) {
                el.setAttribute('placeholder', translation);
            }
        });
    }

    // Update language selector dropdown to show current language
    function updateLanguageSelector(lang) {
        var selector = document.getElementById('language-selector');
        if (selector) {
            var items = selector.querySelectorAll('.dropdown-item');
            items.forEach(function(item) {
                item.classList.remove('active');
                if (item.getAttribute('data-lang') === lang) {
                    item.classList.add('active');
                }
            });
        }

        // Update the dropdown button text
        var btn = document.getElementById('language-dropdown-btn');
        if (btn) {
            var langNames = { en: 'EN', zh: '中' };
            btn.innerHTML = '<i class="fas fa-globe"></i> ' + langNames[lang];
        }
    }

    // Initialize i18n on page load
    function init() {
        var currentLang = getCurrentLanguage();
        applyTranslations(currentLang);
        updateLanguageSelector(currentLang);
        document.documentElement.lang = currentLang;

        // Bind click events to language selector items
        var langItems = document.querySelectorAll('[data-lang]');
        langItems.forEach(function(item) {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                var lang = this.getAttribute('data-lang');
                setLanguage(lang);
            });
        });
    }

    // Expose functions globally
    window.i18n = {
        getCurrentLanguage: getCurrentLanguage,
        setLanguage: setLanguage,
        getTranslation: getTranslation,
        init: init
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
