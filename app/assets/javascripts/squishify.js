
;(function ( $, window, document, undefined ) {

    var pluginName = "squishify",
        defaults = {
          server: "",
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
            $.ajax({
                url: self.settings.server + "/articles/" + self.settings.article_id + ".json",
                dataType: "json"
            })
            .done(function(data) {
                self.renderArticle(data);
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

            var $title = $("<h1>")
                .text(article.title)
                .appendTo($article);

            var $filter = $("<div>")
                .attr("id", "squishifyFilter-" + article.id)
                .addClass("squishifyFilter")
                .appendTo($article);

            var $filterInput = $("<input>")
                .attr("type", "text")
                .attr("placeholder", "Search for a term")
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


            var $miniContent = $("<div>")
                .addClass("squishifyArticle-mini")
                .appendTo($article);

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
                    .appendTo($articleContent);

                //Temporary hack
                var sectionTitleMatches = section.name.match(/:/);
                var sectionTitleDepth = (sectionTitleMatches == null)?0:sectionTitleMatches.length;

                sectionTitle = section.name;
                if(sectionTitleDepth > 0)
                    var sectionTitle = section.name.slice(section.name.lastIndexOf(":") + 1);

                var $sectionTitle = $("<h" + (sectionTitleDepth + 2) + ">")
                    .text(sectionTitle)
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
                        .mouseenter(function() {
                            var paragraph_id = $(this).data("paragraph_id");
                            $("#squishifyParagraphaphMini").removeClass("hover");
                            $("#squishifyParagraphaphMini-" + paragraph_id).addClass("hover");

                            if($("#squishifyParagraphaphMini-" + paragraph_id).position().top < 0
                            || $("#squishifyParagraphaphMini-" + paragraph_id).position().top > $miniContent.height()) {
                                $miniContent.animate({
                                    scrollTop: $("#squishifyParagraphaphMini-" + paragraph_id).position().top + $miniContent.scrollTop()
                                }, 100);
                            }
                        })
                        .mouseleave(function() {
                            var paragraph_id = $(this).data("paragraph_id");
                            $("#squishifyParagraphaphMini-" + paragraph_id).removeClass("hover");
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

            $(document).scroll(function() {
                var scrollPosition = $(document).scrollTop();
                var scrollPct = scrollPosition / $(document).height();
                //$miniContent.scrollTop($miniContent[0].scrollHeight * scrollPct);
            })

            $article.show();
            self.renderMini();
        },

        renderMini: function() {
            var self = this;
            var $mini = $(self.element).find(".squishifyArticle-mini");
            $mini.empty();
            for(var x in self.paragraphs) {
                var paragraph = self.paragraphs[x];
                var $paragraph = $("<div>")
                    .addClass("squishifyParagraph")
                    .attr("id","squishifyParagraphaphMini-" + paragraph.id)
                    .data("paragraph_id", paragraph.id)
                    .text(paragraph.content)
                    .click(function(e) {
                        var paragraph_id = $(this).data("paragraph_id");
                        $('body').animate({
                            scrollTop: $("#squishifyParagraph-" + paragraph_id).offset().top
                        }, 100);
                    })
                    .appendTo($mini);

                var $bigParagraph = $("#squishifyParagraph-" + paragraph.id);
                if(!$bigParagraph.is(":visible"))
                    $paragraph.addClass("filtered")
            }
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
                    if(paragraph.summary == null){
                        isMatch = false;
                        continue
                    }

                    if(paragraph.summary.toLowerCase().indexOf(filter.toLowerCase()) == -1)
                        isMatch = false;
                }

                if(isMatch)
                    matches.push(paragraph);
            }

            if(matches.length > 0) {
                $(".squishifyArticle-content .squishifyParagraph").hide();
                for(var x in matches)
                    $("#squishifyParagraph-" + matches[x].id).show();
            } else {
                $(".squishifyArticle-content .squishifyParagraph").show();
            }

            self.renderMini();
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
