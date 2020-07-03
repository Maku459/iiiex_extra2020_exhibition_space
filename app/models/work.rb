class Work < ApplicationRecord
  WORKS_NAMES = ["boyakerukyoukai", "kehai", "Super_Audio_Racing", "exhibition_space", "Graviter", "Inside-Out_Outside-In_Or", "A_flog_in_his_house", "Projections_of_impressions", "emotional_distance", "NUM", "with_rain"]
  WORKS_INFO = {
      "boyakerukyoukai" => {
          'name' => 'ぼやける境界',
          'image' => '810.jpg',
          'daily_co_url' => 'https://iiiex.daily.co/810_boyakerukyoukai'
      },
      "kehai" => {
          'name' => '気配のふるまい',
          'image' => '811.jpg',
          'daily_co_url' => 'https://iiiex.daily.co/811_kehai'
      },
      "Super_Audio_Racing" => {
          'name' => '大爆走！オーディオレーシング',
          'image' => '812.png',
          'daily_co_url' => "https://iiiex.daily.co/812_super_audio_racing"
      },
      "exhibition_space" => {
          'name' => '展示空間',
          'image' => '813.png',
          'daily_co_url' => "https://iiiex.daily.co/813_exhibition_space"
      },
      "Graviter" => {
          'name' => 'Graviter',
          'image' => '814.jpg',
          'daily_co_url' => "https://iiiex.daily.co/814_graviter"
      },
      "Inside-Out_Outside-In_Or" => {
          'name' => 'Inside-Out,Outside-In,Or',
          'image' => '815.jpg',
          'daily_co_url' => "https://iiiex.daily.co/815_inside_out_outside_in_or"
      },
      "A_flog_in_his_house" => {
          'name' => '居の中の蛙',
          'image' => '816.jpg',
          'daily_co_url' => "https://iiiex.daily.co/816_a_flog_in_his_house"
      },
      "Projections_of_impressions" => {
          'name' => '感情の写像',
          'image' => '817.png',
          'daily_co_url' => "https://iiiex.daily.co/817_projections_of_impressions"
      },
      "emotional_distance" => {
          'name' => 'emotional distance',
          'image' => '818.png',
          'daily_co_url' => "https://iiiex.daily.co/818_emotional_distance"
      },
      "NUM" => {
          'name' => 'NUM. (Ningen Unique Mirror)',
          'image' => '819.png',
          'daily_co_url' => "https://iiiex.daily.co/819_num"
      },
      "with_rain" => {
          'name' => '対雨',
          'image' => '820.png',
          'daily_co_url' => "https://iiiex.daily.co/820_with_rain"
      }
  }
end
