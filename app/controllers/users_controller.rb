class UsersController < ApplicationController
  protect_from_forgery with: :null_session
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
      if @user[:agreeCookie]
        # create cookie in the first time
        create_user()
      else
        # not agreed user
        not_agreed_user()
      end
    else
      saved_user = User.find_by(id: cookies[:user_id])
      if saved_user.nil?
        if @user[:agreeCookie]
          # recreate cookie
          recreate_user()
        else
          # not agreed in this time
          not_agreed_user()
        end
      else
        # already exist
        @user = saved_user
        respond_to do |format|
          notice = 'Your user id : ' + saved_user[:id].to_s + '. This user already exists.'
          format.html { redirect_to @user, notice: notice}
          format.json { render json: { user: @user, status: 409, message: 'conflict : Already Exist' }, status: :conflict }
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
          format.json { render json: { user: @user, status: 500, message: 'Internal server error : faliled to save' }, status: :internal_server_error }
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
      if @user.destroy
        respond_to do |format|
          notice = 'User ' + @user[:id].to_s + ' was successfully deleted.'
          format.html { redirect_to users_url, notice: notice }
          format.json { render json: { user: @user, status: 200, message: 'OK' }, status: :ok }
        end
      else
        respond_to do |format|
          notice = 'Internal server error : faliled to delete'
          format.html { redirect_to users_url, notice: notice }
          format.json { render json: { user: @user, status: 500, message: 'Internal server error : faliled to delete' }, status: :internal_server_error }
        end
      end
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user
      @user = User.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def user_params
      params.require(:user).permit(:agreeCookie, :isExist)
    end

    def create_user
      respond_to do |format|
        if @user.save
          cookies[:user_id] = { value: @user[:id], expires: 4.day }
          notice = 'User was successfully created. User id : ' + @user[:id].to_s
          format.html { redirect_to @user, notice: notice}
          format.json { render json: { user: @user, status: 200, message: 'Created' }, status: :ok }
        else
          format.html { render :new }
          format.json { render json: { user: @user, status: 500, message: 'Internal server error : faliled to save' }, status: :internal_server_error }
        end
      end
    end

    def recreate_user
      respond_to do |format|
        if @user.save
          previous_uid = cookies[:user_id].to_s
          cookies[:user_id] = { value: @user[:id], expires: 4.day }
          notice = 'User id ' + previous_uid + ' was not found, then created again. new User id : ' + @user[:id].to_s
          format.html { redirect_to @user, notice: notice }
          format.json { render json: { user: @user, status: 200, message: 'Created Again' }, status: :ok }
        else
          format.html { render :new }
          format.json { render json: { user: @user, status: 500, message: 'Internal server error : faliled to save' }, status: :internal_server_error }
        end
      end
    end

    def not_agreed_user
      respond_to do |format|
        notice =  'This user not agreed cookies.'
        format.html { redirect_to @user, notice: notice}
        format.json { render json: { user: @user, status: 200, message: 'User does not agree cookie.' }, status: :ok }
      end
    end



end
