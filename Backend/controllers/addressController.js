import addressModel from "../models/addressModel.js";


const addressController = {

    createAddress: async (req, res) => {
        try {
            const {user_id, first_name, last_name, address1, city, post_code, state, phone_number } = req.body;

            const address = await addressModel.create({
                user_id,
                first_name,
                last_name,
                address1,
                city,
                post_code,
                state,
                phone_number
            });
            res.json({
                success: true,
                data: address
            });

        } catch (error) {
            res.json({
                success: false,
                message: error.message
            });
        }
    },

    getUserAddress: async (req, res) => {
        try {
            const { user_id } = req.params;
            const address = await addressModel.findByUserId(user_id);

            res.json({
                success: true,
                data: address
            })
        } catch (error) {
            res.json({
                success: false,
                message: error.message
            });
        }
    },

    //get single address
    getAddress: async (req, res) => {
        try {
            const { id } = req.params;
            const address = await addressModel.findById(id);

            if (!address) {
                return res.json({
                    success: false,
                    message: 'Address not found'
                });
            }
            res.json({
                success: true,
                data: address
            });

        } catch (error) {
            res.json({
                success: false,
                message: error.message
            });
        }
    },

    updateAddress: async (req, res) => {
        try {
            const { id } = req.params;
            const updates = req.body;
            const address = await addressModel.findById(id);

            if (!address) {
                return res.json({
                    success: false,
                    message: 'Address not found'
                });
            }

            const updatedAddress = await addressModel.update(id, updates);

            res.json({
                success: true,
                data: updatedAddress
            });
        } catch (error) {
            res.json({
                success: false,
                message: error.message
            });
        }
    },

    deleteAddress: async (req, res) => {
        try {
            const { id } = req.params;
            const address = await addressModel.delete(id);

           if (!address) {
                return res.json({
                    success: false,
                    message: 'Address not found'
                });
            }

            res.json({
                success: true,
                message: 'Address delete successfully'
            });

        } catch (error) {
            res.json({
                success: false,
                message: error.message
            });
        }
    }
};

export default addressController;