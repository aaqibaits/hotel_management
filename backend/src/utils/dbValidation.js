module.exports = {
    // Check if string has value
    check_string_val: function (val, default_val) {
        if (val == undefined || val == "" || val == null) {
            return default_val;
        }
        return val;
    },

    // Get current date
    current_date: function () {
        return new Date().toISOString().split('T')[0];
    },

    // Get current time
    current_time: function () {
        return new Date().toTimeString().split(' ')[0];
    },

    // Format date for SQL
    format_date: function (date) {
        if (!date) return null;
        return new Date(date).toISOString().split('T')[0];
    }
};