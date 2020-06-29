class UsersController < ApplicationController
  protect_from_forgery
  before_action :set_user, only: [:show, :edit, :update, :destroy]

  # GET /users
  # GET /users.json
  def index
    @users = User.all
  end

  # GET /users/1
  # GET /users/1.json
  def show
    @userv = User.find_by(id: params[:id])
    respond_to do |format|
      if !@user.nil? && !@user[:id].nil?
        notice = 'Your user id : ' + @user[:id].to_s
        format.html { redirect_to action: 'index', notice: notice}
        format.json { render json: { user: @user, status: 200, message: 'ok' }, status: :ok }
      else
        notice = params[:id].to_s + 'was not found.'
        format.html { redirect_to action: 'index', notice: notice}
        format.json { render json: { user: @user, status: 404, message: 'Not Found' }, status: :not_found }
      end
    end
  end
  
  # GET /users/new
  def new
    @user = User.new
  end

  # GET /users/1/edit
  def edit
  end

  # POST /users
  # POST /users.json
  def create
    @user = User.new(user_params)
    if cookies[:user_id].nil?
      # cookie not exist
      @user[:isExist] = true
      respond_to do |format|
        if @user.save
          cookies[:user_id] = { value: @user[:id], expires: 4.day }
          notice = 'User was successfully created. User id : ' + @user[:id].to_s
          format.html { redirect_to @user, notice: notice}
          format.json { render json: { user: @user, status: 200, message: 'Created' }, status: :ok }
        else
          format.html { render :new }
          format.json { render json: { user: @user, status: 500, message: 'Internal server error : faliled to save' }, status: :internal_server_error }
        end
      end
    else
      saved_user = User.find_by(id: cookies[:user_id].to_i)
      if !saved_user.nil? && saved_user[:isExist] == true # # cookie exists and user exists in database
        @user = saved_user
        respond_to do |format|
          notice = 'Your user id : ' + saved_user[:id].to_s + '. This user already exists.'
          format.html { redirect_to @user, notice: notice}
          format.json { render json: { user: @user, status: 409, message: 'conflict : Already Exist' }, status: :conflict }
        end
      else # cookie exists. but user does not exist in database, then recreate user
        @user[:isExist] = true
        respond_to do |format|
          if @user.save
            previous_uid = cookies[:user_id].to_s
            cookies[:user_id] = { value: @user[:id], expires: 4.day }
            notice = 'User id ' + previous_uid + ' was not found, then created again. new User id : ' + @user[:id].to_s
            format.html { redirect_to @user, notice: notice }
            format.json { render json: { user: @user, status: 200, message: 'Created Again' }, status: :ok }
          else
            format.html { render :new }
            format.json { render json: { user: @user, status: 500, message: 'Internal server error : faliled to save' }, status: :internal_server_error }
          end
        end
      end
    end
  end

  # PATCH/PUT /users/1
  # PATCH/PUT /users/1.json
  def update
    if @user.nil?
      respond_to do |format|
        notice = 'User ' + params[:id].to_s + ' was not found.'
        format.html { redirect_to users_url, notice: notice }
        format.json { render json: { user: @user, status: 404, message: 'Not Found' }, status: :not_found }
      end
    else
      respond_to do |format|
        if @user.update(user_params)
          notice = 'User ' +  @user[:id].to_s + ' was successfully updated.'
          format.html { redirect_to @user, notice: notice }
          format.json { render json: { user: @user, status: 200, message: 'OK' }, status: :ok }
        else
          format.html { render :edit }
          format.json { render json: { user: @user, status: 500, message: 'Internal server error : faliled to save' }, status: :internal_server_error }
        end
      end
    end
  end

  # DELETE /users/1
  # DELETE /users/1.json
  def destroy
    if @user.nil?
      respond_to do |format|
        notice = 'User ' + params[:id].to_s + ' was not found.'
        format.html { redirect_to users_url, notice: notice }
        format.json { render json: { user: @user, status: 404, message: 'Not Found' }, status: :not_found }
      end
    else
      if @user[:isExist] == false
        respond_to do |format|
          notice = 'User ' + params[:id].to_s + ' was already deleted.' 
          format.html { redirect_to users_url, notice: notice}
          format.json { render json: { user: @user, status: 404, message: 'Already Deleted' }, status: :not_found }
        end
      else
        @user[:isExist] = false
        if @user.save
          respond_to do |format|
            notice = 'User ' + @user[:id].to_s + ' was successfully logically deleted.'
            format.html { redirect_to users_url, notice: notice }
            format.json { render json: { user: @user, status: 200, message: 'OK' }, status: :ok }
          end
        else 
          respond_to do |format|
            notice = 'User' + @user[:id].to_s + ' was already logically deleted.'
            format.html { redirect_to users_url, notice: notice }
            format.json { render json: { user: @user, status: 500, message: 'Internal server error : faliled to save' }, status: :internal_server_error }
          end
        end
      end      
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user
      @user = User.find_by(id: params[:id])
    end

    # Only allow a list of trusted parameters through.
    def user_params

      params.require(:user).permit(:isExist)
    end
end
