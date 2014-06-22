
;(function ( $, window, document, undefined ) {

    var pluginName = "squishify",
        defaults = {
          server: "squishify.com",
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
            self.paragraphs = [];
            self.filters = [];
            self.renderArticle({
                id: 1,
                sections: [{
                    id:1,
                    title: "Section ONE",
                    paragraphs: [{
                        id:1,
                        content: "The Internet is America’s most important platform for economic growth, innovation, competition, free expression, and broadband investment and deployment. As a “general purpose technology,” the Internet has been, and remains to date, the preeminent 21st century engine for innovation and the economic and social benefits that follow. These benefits flow, in large part, from the open, end-to-end architecture of the Internet, which is characterized by low barriers to entry for developers of new content, applications, services, and devices and a consumer-demand-driven marketplace for their products. As the Commission explained in its 2010 Open Internet Order, the Internet’s open architecture allows innovators and consumers at the edges of the network “to create and determine the success or failure of content, applications, services and devices,” without requiring permission from the broadband provider to reach end users.1 As an open platform, it fosters diversity and it enables people to build communities.",
                        summary: "The open architecture of the Internet, the 21st century's engine for innovation, allows innovators and consumers to create content and applications, without requiring permission from broadband providers.",
                        tags: ["internet", "architecture", "consumer", "barrier", "technology", "innovator", "consumer", "diversity", "community", "economic", "innovation", "competition", "free expression"]
                    },
                    {
                        id:2,
                        content: "We start with a fundamental question: What is the right public policy to ensure that the Internet remains open? This Notice of Proposed Rulemaking (Notice), and the comment process that follows, will turn on this fundamental question. ",
                        summary: "What is the right public policy to ensure that the Internet remains open?",
                        tags: ["open", "comment", "internet"]
                    }]
                },{
                    id:2,
                    title: "Section TWO",
                    paragraphs: [{
                        id:3,
                        content: "Today, there are no legally enforceable rules by which the Commission can stop broadband providers from limiting Internet openness. This Notice begins the process of closing that gap, by proposing to reinstitute the no-blocking rule adopted in 2010 and creating a new rule that would bar commercially unreasonable actions from threatening Internet openness (as well as enhancing the transparency rule that is currently in effect). ",
                        summary: "This begins the process of reinstituting the no-block rule and creating a new rule to bar actions that threaten Internet openness.",
                        tags: ["no-block rule", "notice", "commission", "broadband", "2010", "rule", "openness"]
                    }]
                },]
            })
        },

        /**
         * Render the squishify article
         * @param data the data containing sections, paragraphs, and content
         */
        renderArticle: function(article) {
            var self = this;

            var $article = $("<div>")
                .attr("id", "squishfyArticle-" + article.id)
                .addClass("squishifyArticle")
                .hide()
                .appendTo($(self.element));

            var $filter = $("<div>")
                .attr("id", "squishifyFilter-" + article.id)
                .addClass("squishifyFilter")
                .appendTo($article);

            var $filterInput = $("<input>")
                .attr("type", "text")
                .keyup(function(e) {
                    var text = $(this).val();
                    self.filterSentences(self.filters.concat([text]));

                    // they hit enter
                    if(e.keyCode == 13) {
                        $(this).val("");
                        self.addFilter(text);
                    }
                })
                .appendTo($filter);

            var $filters = $("<ul>")
                .appendTo($filter);

            var $articleContent = $("<div>")
                .addClass("squishifyArticle-content")
                .appendTo($article);

            for(var x in article.sections) {
                var section = article.sections[x];
                self.paragraphs = self.paragraphs.concat(section.paragraphs);

                var $section = $("<div>")
                    .attr("id","squishifySection-" + section.id)
                    .data("section_id", section.id)
                    .addClass("squishifySection")
                    .appendTo($article);

                var $sectionTitle = $("<h1>")
                    .text(section.title)
                    .appendTo($section);

                for(var y in section.paragraphs) {
                    var paragraph = section.paragraphs[y];
                    var $paragraph = $("<div>")
                        .attr("id","squishifyParagraph-" + paragraph.id)
                        .data("paragraph_id", paragraph.id)
                        .addClass("squishifyParagraph")
                        .click(function() {
                            var paragraph_id = $(this).data("paragraph_id");
                            if($(this).hasClass("open"))
                                self.collapseParagraph(paragraph_id);
                            else
                                self.expandParagraph(paragraph_id);
                        })
                        .appendTo($section);

                    var $paragraphSummary = $("<div>")
                        .addClass("squishifyParagraph-summary")
                        .appendTo($paragraph)
                        .text(paragraph.summary);

                    var $paragraphSummary = $("<div>")
                        .addClass("squishifyParagraph-content")
                        .appendTo($paragraph)
                        .hide()
                        .text(paragraph.content);
                }
            }

            $article.show();
        },
        
        /**
         * Add a text to the list of filters
         * @param text the text being added to the list of filters
         */
        addFilter: function(text) {
            var self = this;
            if(self.filters.indexOf(text) == -1)
                self.filters.push(text);
            self.filterSentences(self.filters);
            self.renderFilters(self.filters);
        },

        /**
         * Remove a text from the list of filters
         * @param text the text being added to the list of filters
         */
        removeFilter: function(text) {
            var self = this;
            if(self.filters.indexOf(text) != -1)
                self.filters.splice(self.filters.indexOf(text),1);
            self.filterSentences(self.filters);
            self.renderFilters(self.filters);
        },

        renderFilters: function(filters) {
            var self = this
            var $filterList = $(self.element).find(".squishifyFilter ul");
            $filterList.empty();

            for(var x in filters) {
                var filter = filters[x];
                var $filter = $("<li>")
                    .text(filter)
                    .appendTo($filterList)
                    .click(function(e){
                        self.removeFilter($(this).text());
                    });
            }
        },

        /**
         * Filter the sentences based on a string
         * @param texts the list of text whose sentences we will include
         */
        filterSentences: function(filters) {
            var self = this;
            var matches = [];
            for(var x in self.paragraphs) {
                var paragraph = self.paragraphs[x];
                var isMatch = true;
                for(var y in filters) {
                    var filter = filters[y];
                    if(paragraph.summary.toLowerCase().indexOf(filter.toLowerCase()) == -1)
                        isMatch = false;
                }

                if(isMatch)
                    matches.push(paragraph);
            }

            if(matches.length > 0) {
                $(".squishifyParagraph").hide();
                for(var x in matches)
                    $("#squishifyParagraph-" + matches[x].id).show();
            } else {
                $(".squishifyParagraph").show();
            }
        },

        /**
         * Expand a paragraph by showing its details
         * @param paragraph_id the ID of the sentence to be collapsed
         */
        expandParagraph: function (paragraph_id) {
            var self = this;
            var $paragraph = $("#squishifyParagraph-" + paragraph_id);
            $paragraph.addClass("open");
            $paragraph.find(".squishifyParagraph-content").slideDown(200);
        },

        /**
         * Collapse a paragraph by hiding its details
         * @param paragraph_id the ID of the sentence to be collapsed
         */
        collapseParagraph: function(paragraph_id) {
            var self = this;
            var $paragraph = $("#squishifyParagraph-" + paragraph_id);
            $paragraph.removeClass("open");
            $paragraph.find(".squishifyParagraph-content").slideUp(200);
        },

        /**
         * Create a clip around a specific paragraph ID
         * @param paragraph_id the ID of the paragraph to be used in the clip
         */
        saveClip: function(paragraph_id) {
            var self = this;
            var paragraph = self.getParagraph(paragraph_id);
            self.clips.push({
                paragraph: paragraph
            })
        },

        /**
         * Delete a clip that was saved
         * @param paragraph_id the ID of the paragraph whose clip isbeing deleted
         */
        deleteClip: function(paragraph_id) {
            var self = this;
            for(var x in self.clips){
                var clip = self.clips[x];
                if(clip.paragraph.id == paragraph_id) {
                    self.clips.splice(x,1);
                    return;
                }
            }
        },

        /**
         * Get the paragraph object associated with a paragraph ID
         * @param paragraph_id the ID of the paragraph we want
         */
        getParagraph: function(paragraph_id) {
            var self = this;
            for(var x in self.paragraphs) {
                var paragraph = self.paragraphs[x];
                if(paragraph.id == paragraph_id) return paragraph;
            }
            return null;
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
