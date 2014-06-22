class ArticlesController < ApplicationController
  before_action :set_article, only: [:show]

  # GET /articles
  # GET /articles.json
  def index
    @articles = Article.all

    Jbuilder.encode do |json|
      json.array! @articles do |article|
        json.id article.id
        json.title article.title
        json.(article, :created_at, :updated_at)

        json.sections article.sections do |section|
          json.id section.id
          json.name section.name
          json.rank section.rank

          json.paragraphs section.paragraphs do |paragraph|
            json.id paragraph.id
            json.content paragraph.content
            json.summary paragraph.summary
            json.rank paragraph.rank

            # make tags an array of tags, not objects
            json.tags paragraph.tags do |tag|
              json.id tag.id
              json.content tag.content
            end
          end
        end
      end
    end
  end

  # GET /articles/1
  # GET /articles/1.json
  def show
  end

  # GET /articles/new
  def new
    @article = Article.new
  end

  # # GET /articles/1/edit
  # def edit
  # end

  # POST /articles
  # POST /articles.json
  def create
    @article = Article.new(article_params)

    respond_to do |format|
      if @article.save
        format.html { redirect_to @article, notice: 'Article was successfully created.' }
        format.json { render action: 'show', status: :created, location: @article }
      else
        format.html { render action: 'new' }
        format.json { render json: @article.errors, status: :unprocessable_entity }
      end
    end
  end

  # # PATCH/PUT /articles/1
  # # PATCH/PUT /articles/1.json
  # def update
  #   respond_to do |format|
  #     if @article.update(article_params)
  #       format.html { redirect_to @article, notice: 'Article was successfully updated.' }
  #       format.json { head :no_content }
  #     else
  #       format.html { render action: 'edit' }
  #       format.json { render json: @article.errors, status: :unprocessable_entity }
  #     end
  #   end
  # end

  # # DELETE /articles/1
  # # DELETE /articles/1.json
  # def destroy
  #   @article.destroy
  #   respond_to do |format|
  #     format.html { redirect_to articles_url }
  #     format.json { head :no_content }
  #   end
  # end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_article
      @article = Article.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def article_params
      params.require(:article).permit(:title)
    end
end
