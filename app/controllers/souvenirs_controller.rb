class SouvenirsController < ApplicationController
  before_action :set_souvenir, only: [:show, :edit, :update, :destroy]

  # GET /souvenirs
  # GET /souvenirs.json
  def index
    @souvenirs = Souvenir.all
  end

  # GET /souvenirs/1
  # GET /souvenirs/1.json
  def show
  end

  # GET /souvenirs/new
  def new
    @souvenir = Souvenir.new
  end

  # GET /souvenirs/1/edit
  def edit
  end

  # POST /souvenirs
  # POST /souvenirs.json
  def create
    @souvenir = Souvenir.new(souvenir_params)

    respond_to do |format|
      if @souvenir.save
        format.html { redirect_to @souvenir, notice: 'Souvenir was successfully created.' }
        format.json { render json: { user: @souvenir, status: 200, description: 'Souvenir was successfully created.' }, status: :ok }
      else
        format.html { render :new }
        format.json { render json: { user: @souvenir, status: 500, description: 'Internal server error : faliled to save' }, status: :internal_server_error }
      end
    end
  end

  # PATCH/PUT /souvenirs/1
  # PATCH/PUT /souvenirs/1.json
  def update
    respond_to do |format|
      if @souvenir.update(souvenir_params)
        format.html { redirect_to @souvenir, notice: 'Souvenir was successfully updated.' }
        format.json { render json: { user: @souvenir, status: 200, description: 'Souvenir was successfully updated.' }, status: :ok }
      else
        format.html { render :edit }
        format.json { render json: { user: @souvenir, status: 500, description: 'Internal server error : faliled to save' }, status: :internal_server_error }
      end
    end
  end

  # DELETE /souvenirs/1
  # DELETE /souvenirs/1.json
  def destroy
    @souvenir.destroy
    respond_to do |format|
      format.html { redirect_to souvenirs_url, notice: 'Souvenir was successfully deleted.' }
      format.json { render json: { user: @souvenir, status: 200, description: 'Souvenir was successfully deleted.' }, status: :ok }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_souvenir
      @souvenir = Souvenir.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def souvenir_params
      params.require(:souvenir).permit(:impression, :works_1, :works_2, :works_3, :iris_11, :iris_12, :iris_13, :iris_14, :iris_21, :iris_22, :iris_23, :iris_24, :iris_31, :iris_32, :iris_33, :iris_34)
    end
end
