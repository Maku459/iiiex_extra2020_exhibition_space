require "date"
class UserpositionsController < ApplicationController
  protect_from_forgery with: :null_session
  before_action :set_userposition, only: [:show, :edit, :update, :destroy]

  # GET /userpositions
  # GET /userpositions.json
  def index
    dst = []
    now = DateTime.now
    threshold = now - Rational(30, 24 * 60)
    Userposition.all.each do |userposition|
      # if DateTime.parse(userposition[:created_at].to_s) > threshold
        dst.push(userposition)
      # end
    end
    @userpositions = dst
  end

  # GET /userpositions/1
  # GET /userpositions/1.json
  def show
  end

  # GET /userpositions/new
  def new
    @userposition = Userposition.new
  end

  # GET /userpositions/1/edit
  def edit
  end

  # POST /userpositions
  # POST /userpositions.json
  def create
    @userposition = Userposition.new(userposition_params)
    # not save the same position.
    if same_position_exists()
      respond_to do |format|
        format.html { redirect_to @userposition, notice: 'this position is already exists.' }
        format.json { render json: { user: @userposition, status: 200, message: 'this position is already exists.' }, status: :ok }
      end
      return
    end

    if cookies[:user_id].nil?
      @userposition[:userid] = -1
      respond_to do |format|
        if @userposition.save
          format.html { redirect_to @userposition, notice: 'Userposition was successfully created.' }
          format.json { render json: { user: @userposition, status: 200, message: 'Created, no userid' }, status: :ok }
        else
          format.html { render :new }
          format.json { render json: { user: @userposition, status: 500, message: 'Internal server error : faliled to save' }, status: :internal_server_error }
        end
      end
    else
      @userposition[:userid] = cookies[:user_id]
      respond_to do |format|
        if @userposition.save
          format.html { redirect_to @userposition, notice: 'Userposition was successfully created.' }
          format.json { render json: { user: @userposition, status: 200, message: 'Created' }, status: :ok }
        else
          format.html { render :new }
          format.json { render json: { user: @userposition, status: 500, message: 'Internal server error : faliled to save' }, status: :internal_server_error }
        end
      end
    end
  end

  # PATCH/PUT /userpositions/1
  # PATCH/PUT /userpositions/1.json
  def update
    if @userposition.update(userposition_params)
      format.html { redirect_to @userposition, notice: 'Userposition was successfully updated.' }
      format.json { render json: { user: @userposition, status: 200, message: 'Updated' }, status: :ok }
    else
      format.html { render :edit }
      format.json { render json: { user: @userposition, status: 500, message: 'Internal server error : faliled to save' }, status: :internal_server_error }
    end
  end

  # DELETE /userpositions/1
  # DELETE /userpositions/1.json
  def destroy
    @userposition.destroy
    respond_to do |format|
      format.html { redirect_to userpositions_url, notice: 'Userposition was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  # 	2020-06-30 04:31:37 UTC
  def regularly_delete
    threshold = 15
    if Userposition.count < threshold
      render json: { status: 200, message: 'userposition table is too few (' + Userposition.count.to_s + ' records ) . failed to delete' }, status: :ok
      return
    end

    Userposition.first(Userposition.count - threshold).each do | userposition |
      now = DateTime.now
      created_time = DateTime.parse(userposition[:created_at].to_s)
      if now - Rational(10, 24*60) > created_time
        unless userposition.destroy
          render json: { status: 500, message: 'Internal server error : faliled to regularly delete' }, status: :internal_server_error 
        end
      end
    end

    render json: { status: 200, message: 'Completed regularly delete' }, status: :ok
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_userposition
      @userposition = Userposition.find_by(id: params[:id])
    end

    # Only allow a list of trusted parameters through.
    def userposition_params
      params.require(:userposition).permit(:userid, :x, :y, :z)
    end

    def same_position_exists
      !@userposition.nil? && Userposition.where(x: @userposition.x).where(y: @userposition.y).where(z: @userposition.z).exists? ? true : false
    end
end
