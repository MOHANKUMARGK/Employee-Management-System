// let express=require("express")


let adminregisterController = async (req, res) => {
    try {
        const data = req.body;
        const { password, email } = data;

        const emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailCheck.test(email)) {
            return res.status(400).send({message: "Invalid email format"});
        }

        const passwordCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordCheck.test(password)) {
            return res.status(400).send({
                message: "Give valid password"
            });
        }

        const isUser = await AdminRegister.findOne({email});
        if (isUser) {
            return res.status(400).send({message: "Email already registered"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userData = new AdminRegister({...data, password: hashedPassword});
        await userData.save();

        res.status(200).send({message: "Successfully Registered"});
    } catch (error) {
        res.status(500).send({message: "Internal Server Error"});
    }
}

module.exports={adminregisterController}