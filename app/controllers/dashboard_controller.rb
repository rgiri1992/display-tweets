class DashboardController < ApplicationController

  # Config Vatiables
  CACHE_HISTORY_HOURS = 1
  RADIUS_KMs = 50

  def index
    
  end

  def fetch_tweets
    # Check if all the paramaters are available
    if params[:word] && params[:lat] && params[:lng]

      # Check if data already exists in database
      search_history = TweetHistory.where("word = ? AND created_at > ?", params[:word], CACHE_HISTORY_HOURS.hours.ago)
      if search_history.count > 0
        # If exists in database, return from database
        data = JSON(search_history[0].tweet_data)
      else

        # If data doesnt exists in database, fetch from api
        data = Tweet.find_tweet(params[:word], params[:lat], params[:lng], RADIUS_KMs)
        TweetHistory.create(:word => params[:word], :tweet_data => data.to_json)

      end
      render json: data
    else
      render json: {:error => 'Could not be processed'}
    end
  end

  def fetch_search_history
    # List of Search History
    render json: TweetHistory.select('word').where("created_at > ?", CACHE_HISTORY_HOURS.hours.ago)
  end

end
