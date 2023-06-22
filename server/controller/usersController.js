const User = require("../model/userModel")
const bcrypt = require("bcrypt")


module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body
        const usernameCheck = await User.findOne({ username })
        if (usernameCheck) return res.json({ msg: "Username already used", status: false })
        const emailCheck = await User.findOne({ email })
        if (emailCheck) return res.json({ msg: "Email already used", status: false })

        const hashedPassword = await bcrypt.hash(password, 10)
        // console.log(hashedPassword)
        const user = await User.create({
            email,
            username,
            password: hashedPassword,
        })

        delete user.password
        return res.json({ status: true, user })
    } catch (ex) {
        next(ex)
    }
}

module.exports.login = async (req, res, next) => {
    try {
        // get info from FE
        const { username, password } = req.body
        const user = await User.findOne({ username })
        if (!user) return res.json({ msg: "Incorrect username or password", status: false })
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) return res.json({ msg: "Incorrect username or password", status: false })
        delete user.password
        return res.json({ status: true, user })
    } catch (ex) {
        next(ex)
    }
}
module.exports.setAvatar = async (req, res, next) => {
    try {
        //get infor user from FE (component SetAvatar)
        const userId = req.params.id // id === id (line 7 -> userRoutes)
        const avatarImage = req.body.image // image (line 43 -> SetAvatar component)
        const userData = await User.findByIdAndUpdate(userId, {
            isAvatarImageSet: true,
            avatarImage,
        })
        userData.save()
        console.log(avatarImage);
        // console.log(userData);
        return res.json(
            {
                isSet: userData.isAvatarImageSet,
                image: userData.avatarImage
            }
        )
    } catch (ex) {
        next(ex)
    }
}

//api
module.exports.getAllUsers = async (req, res, next) => {

    try {
        const users = await User.find({ _id: { $ne: req.params.id } }).select([
            "email",
            "username",
            "avatarImage",
            "id"
        ])
        return res.json(users)
    } catch (ex) {
        next(ex)
    }
}

// getData gọi API truyền vào params là currentUser._id
// gọi đến API /api/auth/allusers (router.get("/allusers:id", (getAllUsers)))
// trong API trên thì sẽ gọi tới Model User sử dụng phương thức find (trả về nhiều collection) với điều kiện bên trong là field _id != param truyền vào (tức là currentUser._id)
// .select... (để lấy ra các field mong muốn)
// sau đó API trả về danh sách users vừa select
// bên frontend nhận được data => gán vào state contacts