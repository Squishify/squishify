class Section < ActiveRecord::Base
  has_many :paragraphs
  belongs_to :article
end
