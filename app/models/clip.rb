class Clip < ActiveRecord::Base
  belongs_to :paragraph
  belongs_to :response
end
