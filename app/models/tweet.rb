class Tweet < ApplicationRecord


  def self.client
    Twitter::REST::Client.new do |config|
      config.consumer_key        = "019T0K4UQI6T1QNC02xd5sTg9"
      config.consumer_secret     = "zfAAg03ZBjt63b1IA2KCoFBlEQCTdpPKW2mE4Pua0yLQc0QDEA"
      config.access_token        = "167305576-K3flAxFZDHWc6rROCDOXXgA0SVqqO1pkpT25zTEs"
      config.access_token_secret = "IOoU301ruBnthWtLdLy2K4L8XH0ycyfes8PsoSsQQQN7z"
    end
  end

  def self.find_tweet keyword, lat, lng, radius
     a = Tweet.client.search("#{keyword}", result_type: "recent", geocode: "#{lat},#{lng},#{radius}km").map do |t|
      if t.geo && !t.geo.nil?
          {
            username: t.user.screen_name,
            profile_image_url: t.user.profile_image_url.to_s,
            tweet: t.text,
            coordinates: t.geo
          }
        else
          nil
        end
     end
     a.compact
  end

end
