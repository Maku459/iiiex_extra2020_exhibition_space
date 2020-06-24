class UserpositionsController < ApplicationController
  before_action :set_userposition, only: [:show, :edit, :update, :destroy]

  # GET /userpositions
  # GET /userpositions.json
  def index
    @userpositions = Userposition.all
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
    if cookies[:user_id].nil?
      @userposition[:userid] = -1
      respond_to do |format|
        if @userposition.save
          format.html { redirect_to @userposition, notice: 'Userposition was successfully created.' }
          format.json { render json: { user: @userposition, status: 200, description: 'Created, no userid' }, status: :created }
        else
          format.html { render :new }
          format.json { render json: { user: @userposition, status: 500, description: 'Internal server error : faliled to save' }, status: :internal_server_error }
        end
      end
    else
      @userposition[:userid] = cookies[:user_id]
      respond_to do |format|
        if @userposition.save
          format.html { redirect_to @userposition, notice: 'Userposition was successfully created.' }
          format.json { render json: { user: @userposition, status: 200, description: 'Created' }, status: :created }
        else
          format.html { render :new }
          format.json { render json: { user: @userposition, status: 500, description: 'Internal server error : faliled to save' }, status: :internal_server_error }
        end
      end
    end
  end

  # PATCH/PUT /userpositions/1
  # PATCH/PUT /userpositions/1.json
  def update
    if cookies[:user_id].nil?
      respond_to do |format|
        format.html { redirect_to users_url, notice: 'Unauthorized user.' }
        format.json { render json: { user: @userposition, status: 401, description: 'Unauthorized' }, status: :unauthorized }
      end
    else
      if @userposition[:userid] != cookies[:user_id]
        respond_to do |format|
          format.html { redirect_to users_url, notice: 'Unauthorized user.' }
          format.json { render json: { user: @userposition, status: 401, description: 'Unauthorized' }, status: :unauthorized }
        end
      else
        if @userposition.update(userposition_params)
          format.html { redirect_to @userposition, notice: 'Userposition was successfully updated.' }
          format.json { render json: { user: @userposition, status: 200, description: 'No Content' }, status: :no_content }
        else
          format.html { render :edit }
          format.json { render json: { user: @userposition, status: 500, description: 'Internal server error : faliled to save' }, status: :internal_server_error }
        end
      end
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

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_userposition
      @userposition = Userposition.find_by(id: params[:id])
    end

    # Only allow a list of trusted parameters through.
    def userposition_params
      params.require(:userposition).permit(:userid, :x, :y, :z)
    end
end
