class LoginsController < ApplicationController
  protect_from_forgery with: :null_session
  before_action :set_login, only: [:show, :edit, :update, :destroy]

  # GET /logins
  # GET /logins.json
  def index
    @logins = Login.all
  end

  # GET /logins/1
  # GET /logins/1.json
  def show
  end

  # GET /logins/new
  def new
    @login = Login.new
  end

  # GET /logins/1/edit
  def edit
  end

  # POST /logins
  # POST /logins.json
  def create
    @login = Login.new(login_params)
    if cookies[:login_id].nil?
      # cookie not exist
      @login[:isExist] = true
      respond_to do |format|
        if @login.save
          cookies[:login_id] = { value: @login[:id], expires: 4.day }
          notice = 'Admin User was successfully created. Admin User id : ' + @login[:id].to_s
          format.html { redirect_to @login, notice: notice}
          format.json { render json: { user: @login, status: 200, description: 'Created' }, status: :created }
        else
          format.html { render :new }
          format.json { render json: { user: @login, status: 500, description: 'Internal server error : faliled to save' }, status: :internal_server_error }
        end
      end
    else
      saved_login = Login.find_by(id: cookies[:login_id].to_i)
      if !saved_login.nil? && saved_login[:isExist] == true # # cookie exists and user exists in database
        @login = saved_login
        respond_to do |format|
          notice = 'Your user id : ' + saved_login[:id].to_s + '. This user already exists.'
          format.html { redirect_to @login, notice: notice}
          format.json { render json: { user: @login, status: 409, description: 'conflict : Already Exist' }, status: :conflict }
        end
      else # cookie exists. but user does not exist in database, then recreate user
        @login[:isExist] = true
        respond_to do |format|
          if @login.save
            previous_uid = cookies[:login_id].to_s
            cookies[:login_id] = { value: @login[:id], expires: 4.day }
            notice = 'Admin User id ' + previous_uid + ' was not found, then created again. new Admin User id : ' + @login[:id].to_s
            format.html { redirect_to @login, notice: notice }
            format.json { render json: { user: @login, status: 200, description: 'Created Again' }, status: :created }
          else
            format.html { render :new }
            format.json { render json: { user: @login, status: 500, description: 'Internal server error : faliled to save' }, status: :internal_server_error }
          end
        end
      end
    end
  end

  # PATCH/PUT /logins/1
  # PATCH/PUT /logins/1.json
  def update
    if @login.nil?
      respond_to do |format|
        notice = 'Admin User ' + params[:id].to_s + ' was not found.'
        format.html { redirect_to logins_url, notice: notice }
        format.json { render json: { user: @login, status: 404, description: 'Not Found' }, status: :not_found }
      end
    else
      respond_to do |format|
        if @login.update(login_params)
          notice = 'Admin User ' +  @login[:id].to_s + ' was successfully updated.'
          format.html { redirect_to @login, notice: notice }
          format.json { render json: { user: @login, status: 200, description: 'No Content' }, status: :no_content }
        else
          format.html { render :edit }
          format.json { render json: { user: @login, status: 500, description: 'Internal server error : faliled to save' }, status: :internal_server_error }
        end
      end
    end
  end

  # DELETE /logins/1
  # DELETE /logins/1.json
  def destroy
    if @login.nil?
      respond_to do |format|
        notice = 'Admin User ' + params[:id].to_s + ' was not found.'
        format.html { redirect_to logins_url, notice: notice }
        format.json { render json: { user: @login, status: 404, description: 'Not Found' }, status: :not_found }
      end
    else
      if @login[:isExist] == false
        respond_to do |format|
          notice = 'Admin User ' + params[:id].to_s + ' was already deleted.' 
          format.html { redirect_to logins_url, notice: notice}
          format.json { render json: { user: @login, status: 404, description: 'Already Deleted' }, status: :not_found }
        end
      else
        @login[:isExist] = false
        if @login.save
          respond_to do |format|
            notice = 'Admin User ' + @login[:id].to_s + ' was successfully logically deleted.'
            format.html { redirect_to logins_url, notice: notice }
            format.json { render json: { user: @login, status: 200, description: 'No Content' }, status: :no_content }
          end
        else 
          respond_to do |format|
            notice = 'Admin User' + @login[:id].to_s + ' was already logically deleted.'
            format.html { redirect_to logins_url, notice: notice }
            format.json { render json: { user: @login, status: 500, description: 'Internal server error : faliled to save' }, status: :internal_server_error }
          end
        end
      end      
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_login
      @login = Login.find_by(id: params[:id])
    end

    # Only allow a list of trusted parameters through.
    def login_params
      params.require(:login).permit(:isExist)
    end
end
