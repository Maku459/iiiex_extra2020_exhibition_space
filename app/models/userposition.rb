# HTTP Requestを介さずにdbに触れるためのクラス
class Userposition < ApplicationRecord
  # create Userposition
  def create_userposition(x: float, y: float, z: float)
    userposition = Userposition.new(x: x, y: y, z: z)
    userposition.save ? userposition : nil
  end

  # list Userposition
  def list_userposition
    userposiion = Userposition.order(created_at: :desc)
    !userposiion.empty? ? userposiion : nil
  end

  # get Userposition record
  def get_userposition_by_id(id: int)
    userposition = Userposition.find(id)
    !userposition.nil? ? userposition : nil
  end

  # update Userposition
  def update_userposition(id: int, x: float, y: float, z: float)
    userposition = Userposition.find(id)
    userposition.x = x
    userposition.y = y
    userposition.z = z
    userposition.save ? userposition : nil
  end

  # delete Userposition
  def delete_userposition(id: int)
    userposition = Userposition.find_by(id: id)
    if userposition.nil?
      nil
    else userposition.destroy ? userposition : nil
    end
  end
end
