class AddArticleIdToSections < ActiveRecord::Migration
  def change
    add_column :sections, :article_id, :integer
  end
end
