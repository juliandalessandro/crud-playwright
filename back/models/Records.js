module.exports = (sequelize, DataTypes) => {

    const records = sequelize.define("records", {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Title cannot be empty"
                }
            }
        },
        artist: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Artist cannot be empty"
                }
            }
        },
        year: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: {
                    msg: "Year must be an integer"
                },
                notNull: {
                    msg: "Year cannot be null"
                },
                min: {
                    args: [1600],
                    msg: "Year must be greater than or equal to 1600"
                },
                isNotFuture(value) {
                    const currentYear = new Date().getFullYear();
                    if (value > currentYear) {
                        throw new Error("Year cannot be in the future");
                    }
                }
            }
        },
        genre: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Genre cannot be empty"
                }
            }
        },cover: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Cover cannot be empty"
                },
                isUrl: {
                    msg: "Cover must be a valid URL"
                }
            }   
        }
    });

    return records;

}