/**
 * Module for load and start codex-editor
 *
 * Using:
 *
 * codex.writing.prepare({
 *     holderId : 'placeForEditor',                                         // (required)
 *     hideEditorToolbar : <?= $hideEditorToolbar ? 'true' : 'false' ?>,
 *     items : <?= json_encode($page->blocks) ?: '[]' ?>,
 *     pageId   : <?= $page->id ?>,
 *     parentId : <?= $page->id_parent ?>,
 * }).then(
 *    codex.writing.init
 * );
 */

const writing = () => {

    // /**
    //  * CodeX Editor Personality-tool
    //  * @see  https://github.com/codex-editor/personality
    //  */
    // const personalityTool = require('exports-loader?cdxEditorPersonality!codex.editor.personality');
    //
    // /**
    //  * CodeX Editor link embed tool
    //  * @see  https://github.com/codex-editor/link
    //  */
    // const linkTool = require('exports-loader?cdxEditorLink!codex.editor.link');

    let editorIsReady = false,
        settings = {
            hideEditorToolbar   : false,
            titleId             : 'editorWritingTitle',
            initialBlockPlugin  : 'paragraph',
            data                : {items: []},
            resources           : [],
            holderId            : null,
            pageId              : 0,
            parentId            : 0,
        };

    /**
     * Prepare editor's resourses
     *
     * @param  {Object} initSettings    base settings for editor
     * @return {Promise}            all editor's resources are ready
     */
    const prepare = (initSettings) => {

        mergeSettings(initSettings);

        return loadEditorResources(settings.resources)
            .then(() => {

                editorIsReady = true;

            });

    };

    /**
     * Fill module's settings by settings from params
     *
     * @param  {Object} initSettings  list of params from init
     */
    const mergeSettings = (initSettings) => {

        for (let key in initSettings) {

            settings[key] = initSettings[key];

        }

    };

    /**
     * Run editor
     */
    const startEditor = () => {

        /**
         * @todo get from server
         */
        const EDITOR_IMAGE = 1,
            EDITOR_FILE  = 2,
            EDITOR_PERSONALITY  = 6;

        codex.editor.start({

            holderId:  settings.holderId,
            initialBlockPlugin : settings.initialBlockPlugin,
            hideToolbar: settings.hideEditorToolbar,
            sanitizer: {
                tags : {
                    p : {},
                    a : {
                        href: true,
                        target: '_blank'
                    }
                }
            },
            tools : {
                paragraph: {
                    type               : 'paragraph',
                    iconClassname      : 'ce-icon-paragraph',
                    render             : window.paragraph.render,
                    validate           : window.paragraph.validate,
                    save               : window.paragraph.save,
                    allowedToPaste     : true,
                    showInlineToolbar  : true,
                    destroy            : window.paragraph.destroy,
                    allowRenderOnPaste : true
                },
                header: {
                    type             : 'header',
                    iconClassname    : 'ce-icon-header',
                    appendCallback   : window.header.appendCallback,
                    makeSettings     : window.header.makeSettings,
                    render           : window.header.render,
                    validate         : window.header.validate,
                    save             : window.header.save,
                    destroy          : window.header.destroy,
                    displayInToolbox : true
                },
                image: {
                    type                  : 'image',
                    iconClassname         : 'ce-icon-picture',
                    appendCallback        : window.image.appendCallback,
                    prepare               : window.image.prepare,
                    makeSettings          : window.image.makeSettings,
                    render                : window.image.render,
                    save                  : window.image.save,
                    destroy               : window.image.destroy,
                    isStretched           : true,
                    showInlineToolbar     : true,
                    displayInToolbox      : true,
                    renderOnPastePatterns : window.image.pastePatterns,
                    config: {
                        uploadImage : '/upload/' + EDITOR_IMAGE,
                        uploadFromUrl : ''
                    }
                },
                attaches: {
                    type             : 'attaches',
                    displayInToolbox : true,
                    iconClassname    : 'cdx-attaches__icon',
                    prepare          : window.cdxAttaches.prepare,
                    render           : window.cdxAttaches.render,
                    save             : window.cdxAttaches.save,
                    validate         : window.cdxAttaches.validate,
                    destroy          : window.cdxAttaches.destroy,
                    appendCallback   : window.cdxAttaches.appendCallback,
                    config: {
                        fetchUrl: '/upload/' + EDITOR_FILE,
                        maxSize: codex.appSettings.uploadMaxSize * 1000,
                    }
                },
                list: {
                    type: 'list',
                    iconClassname: 'ce-icon-list-bullet',
                    make: window.list.make,
                    appendCallback: null,
                    makeSettings: window.list.makeSettings,
                    render: window.list.render,
                    validate: window.list.validate,
                    save: window.list.save,
                    destroy: window.list.destroy,
                    displayInToolbox: true,
                    showInlineToolbar: true,
                    enableLineBreaks: true,
                    allowedToPaste: true
                },
                // link: {
                //     type             : 'link',
                //     iconClassname    : 'cdx-link-icon',
                //     displayInToolbox : true,
                //     prepare          : linkTool.prepare,
                //     render           : linkTool.render,
                //     makeSettings     : linkTool.settings,
                //     save             : linkTool.save,
                //     destroy          : linkTool.destroy,
                //     validate         : linkTool.validate,
                //     config           : {
                //         fetchURL         : '/fetchURL',
                //         defaultStyle     : 'smallCover'
                //     }
                // },
                raw : {
                    type: 'raw',
                    displayInToolbox: true,
                    iconClassname: 'raw-plugin-icon',
                    render: window.rawPlugin.render,
                    save: window.rawPlugin.save,
                    validate: window.rawPlugin.validate,
                    destroy: window.rawPlugin.destroy,
                    enableLineBreaks: true,
                    allowPasteHTML: true
                },
                // personality: {
                //     type             : 'personality',
                //     displayInToolbox : true,
                //     iconClassname    : 'cdx-personality-icon',
                //     prepare          : personalityTool.prepare,
                //     render           : personalityTool.render,
                //     save             : personalityTool.save,
                //     validate         : personalityTool.validate,
                //     destroy          : personalityTool.destroy,
                //     enableLineBreaks : true,
                //     showInlineToolbar: true,
                //     config: {
                //         uploadURL: '/upload/' + EDITOR_PERSONALITY,
                //     }
                // }
            },

            data : settings.data
        });

        let titleInput = document.getElementById(settings.titleId);

        /**
         * Focus at the title
         */
        titleInput.focus();
        titleInput.addEventListener('keydown', titleKeydownHandler );

    };

    /**
     * Title input keydowns
     * @description  By ENTER, sets focus on editor
     * @param  {Event} event  - keydown event
     */
    const titleKeydownHandler = (event) => {

        /* Set focus on Editor by Enter     */
        if (event.keyCode === codex.core.keys.ENTER) {

            event.preventDefault();

            focusRedactor();

        }

    };

    /**
     * Temporary scheme to focus Codex Editor first-block
     */
    const focusRedactor = function () {

        const firstBlock = codex.editor.nodes.redactor.firstChild,
            contentHolder = firstBlock.firstChild;

        let firstToolWrapper = contentHolder.firstChild,
            aloneTextNode;

        /**
         * Caret will not be placed in empty textNode, so we need textNode with zero-width char
         */
        aloneTextNode = document.createTextNode('\u200B');

        /**
         * We need to append manually created textnode before returning
         */
        firstToolWrapper.appendChild(aloneTextNode);

        codex.editor.caret.set(firstToolWrapper, 0, 0);

    };

    /**
     * Public function to run editor
     */
    const init = function (moduleSettings) {

        console.log(moduleSettings);

        if (!editorIsReady) return;

        // startEditor();

    };

    /**
     * Show form and hide placeholder
     *
     * @param  {Element} targetClicked       placeholder with wrapper
     * @param  {String}  formId               remove 'hide' from this form by id
     * @param  {String}  hidePlaceholderClass add this class to placeholder
     */
    const open = (targetClicked, formId, hidePlaceholderClass) => {

        if (!editorIsReady) return;

        const holder = targetClicked;

        document.getElementById(formId).classList.remove('hide');
        holder.classList.add(hidePlaceholderClass);
        holder.onclick = null;

        init();

    };

    /**
     * Load editor resources and append block with them to body
     *
     * @param  {Array} resources list of resources which should be loaded
     * @return {Promise}
     */
    const loadEditorResources = (resources) => {

        return Promise.all(
            resources.map(loadResource)
        );

    };

    /**
     * Loads resource
     *
     * @param  {Object} resource name and paths for js and css
     * @return {Promise}
     */
    const loadResource = (resource) => {

        const name = resource.name,
            scriptUrl = resource.path.script,
            styleUrl = resource.path.style;

        return Promise.all([
            codex.loader.importScript(scriptUrl, name),
            codex.loader.importStyle(styleUrl, name)
        ]);

    };

    /**
     * Prepares form to submit
     */
    const getForm = () => {

        const atlasForm = document.forms.atlas;

        if (!atlasForm) return;

        /**
         * Save blocks
         */
        codex.editor.saver.saveBlocks();

        return atlasForm;

    };

    /**
     * Send ajax request with writing form data
     * @param button - submit button (needed to add loading animation)
     */
    const submit = (button) => {

        const buttonLoadingClass = 'loading';

        /**
         * Prevent multiple submitting
         */
        if (button.classList.contains(buttonLoadingClass)) {

            return;

        }

        const title = document.forms.atlas.elements['title'];

        let form;

        if (!title.value.trim()) {

            codex.editor.notifications.notification({
                type: 'warn',
                message: 'Заполните заголовок'
            });

            return;

        }

        form = getForm();

        button.classList.add(buttonLoadingClass);

        window.setTimeout(() => {

            form.elements['content'].value = JSON.stringify({items: codex.editor.state.jsonOutput});

            codex.ajax.call({
                url: '/p/save',
                data: new FormData(form),
                success: (response) => {

                    button.classList.remove(buttonLoadingClass);
                    submitResponse(response);

                },
                type: 'POST'
            });

        }, 500);

    };

    /**
     * Response handler for page saving
     * @param {Object} response
     */
    const submitResponse = function (response) {

        response = JSON.parse(response);

        if (response.success) {

            window.location = response.redirect;
            return;

        }

        codex.editor.notifications.notification({
            type: 'warn',
            message: response.message
        });

    };

    /**
     * Submits writing form for opening in full-screan page without saving
     */
    const openEditorFullscreen = () => {

        const form = getForm();

        window.setTimeout(() => {

            form.elements['content'].value = JSON.stringify({ items: codex.editor.state.jsonOutput });
            form.submit();

        }, 500);

    };

    return {
        init,
        prepare,
        open,
        openEditorFullscreen,
        submit,
    };

};

module.exports = writing();