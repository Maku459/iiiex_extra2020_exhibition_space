class UserpositionsController < ApplicationController
  protect_from_forgery
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

    respond_to do |format|
      if @userposition.save
        format.html { redirect_to @userposition, notice: 'Userposition was successfully created.' }
        format.json { render :show, status: :created, location: @userposition }
      else
        format.html { render :new }
        format.json { render json: @userposition.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /userpositions/1
  # PATCH/PUT /userpositions/1.json
  def update
    respond_to do |format|
      if @userposition.update(userposition_params)
        format.html { redirect_to @userposition, notice: 'Userposition was successfully updated.' }
        format.json { render :show, status: :ok, location: @userposition }
      else
        format.html { render :edit }
        format.json { render json: @userposition.errors, status: :unprocessable_entity }
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
      @userposition = Userposition.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def userposition_params
      params.require(:userposition).permit(:x, :y, :z)
    end
end
