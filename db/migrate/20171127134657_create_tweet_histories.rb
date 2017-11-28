class CreateTweetHistories < ActiveRecord::Migration[5.0]
  def change
    create_table :tweet_histories do |t|
      t.string :word
      t.string :tweet_data

      t.timestamps
    end
  end
end
