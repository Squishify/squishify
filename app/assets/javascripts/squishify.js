
;(function ( $, window, document, undefined ) {

    var pluginName = "squishify",
        defaults = {
          server: "squishify.com"
          article_id: 0
        };

    function Plugin ( element, options ) {
        this.element = element;
        this.settings = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    $.extend(Plugin.prototype, {
        init: function () {
          var self = this;

        },

        /**
         * Render the squishify
         * @param data the data containing sections, paragraphs, and content
         */
        renderSquishify: function(data) {
        },

        /**
         * Filter the sentences based on tag
         * @param tags the list of tags whose sentences we will include
         */
        filterSentences: function(tags) {
        },

        /**
         * Expand a sentence by showing its details
         * @param sentence_id the ID of the sentence to be collapsed
         */
        expandSentence: function (sentence_id) {
        },

        /**
         * Collapse a sentence by hiding its details
         * @param sentence_id the ID of the sentence to be collapsed
         */
        collapseSentence: function(sentence_id) {
        },

        /**
         * Create a clip around a specific sentence ID
         * @param sentence_id the ID of the sentence to be used in the clip
         */
        saveClip: function(sentence_id) {
        },

        /**
         * Delete a clip that was saved
         * @param clip_id the ID of the clip being deleted
         */
        deleteClip: function(clip_id) {
        },

        /**
         * Save the response to this squishify
         * @param clips the list of clicks that are linked to the response
         * @param text the text that makes up the response
         */
        saveResponse: function(clips, text) {
        },
        
    });

    $.fn[ pluginName ] = function ( options ) {
        this.each(function() {
            if ( !$.data( this, "plugin_" + pluginName ) ) {
                $.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
            }
        });

        // chain jQuery functions
        return this;
    };

})( jQuery, window, document );
