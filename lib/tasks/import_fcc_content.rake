require 'CSV'

desc "Import data from csv file"
task :import => [:environment] do

  CSV.foreach('lib/assets/data.csv', :headers => true, :encoding => 'ISO-8859-1:UTF-8') do |row|
    Paragraph.create ({
      :content => row['Paragraph'],
      :summary => row['Summary_Sentence']
    })
  end

end