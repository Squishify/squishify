class CreateParagraphsTags < ActiveRecord::Migration
  def change
    create_table :paragraphs_tags do |t|
      t.belongs_to :paragraph, index: true
      t.belongs_to :tag, index: true
    end
  end
end
