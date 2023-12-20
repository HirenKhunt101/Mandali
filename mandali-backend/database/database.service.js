var mongoose = require("mongoose");
mongoose.set("returnOriginal", false);
require("dotenv").config({ path: __dirname + "./../.env" });

class MandaliDatabase {
  constructor() {
    this.apiStartTime = new Date().getTime();
    this.db_con, this.timer;
    this.db_url = process.env.DB_URL;
    this.database_name = process.env.DB_NAME;
    setImmediate(async () => {
      this.db_con = await this._createConnection();
    });
  }

  check_connection = () => {
    if (this.db_con != undefined) {
      clearInterval(this.timer);
      return true;
    }
    return false;
  };

  _createConnection = async () => {
    try {
      mongoose
        .connect(this.db_url + this.database_name, {
          // useNewUrlParser: true,
          // useCreateIndex: true,
          // useUnifiedTopology: true,
          // useFindAndModify: false,
        })
        .then(() => {
          console.log("mongo connection success");
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(`error while creating connection : ${error}`);
      throw error;
    }
  };

  insertIntoCollection = (model_name, session) => {
    return new Promise((resolve, reject) => {
      if (typeof model_name == "object") {
        let documentToSave = model_name;

        if (session != null) {
          documentToSave = {
            ...model_name,
            session: session,
          };
        }

        documentToSave
          .save()
          .then((result) => {
            resolve(result);
          })
          .catch((error) => {
            reject(error);
          });
      } else {
        reject({
          status: 104,
          message: "Invalid insert",
        });
      }
    });
  };

  updateCollection = (
    model_name,
    update_condition_obj,
    new_values,
    session
  ) => {
    return new Promise((resolve, reject) => {
      if (
        typeof update_condition_obj != "string" &&
        typeof new_values != "string"
      ) {
        if (session == undefined) {
          model_name.findOneAndUpdate(
            update_condition_obj,
            new_values,
            {
              runValidators: true,
            },
            (e, result) => {
              if (!e) {
                resolve(result);
              } else {
                reject(e);
              }
            }
          );
        } else {
          model_name.findOneAndUpdate(
            update_condition_obj,
            new_values,
            {
              runValidators: true,
              session: session,
            },
            (e, result) => {
              if (!e) {
                resolve(result);
              } else {
                reject(e);
              }
            }
          );
        }
      } else {
        reject({
          status: 104,
          message: "Invalid parameters for update",
        });
      }
    });
  };

  updateMultiple = (model_name, update_condition_obj, new_values, session) => {
    return new Promise((resolve, reject) => {
      if (
        typeof update_condition_obj != "string" &&
        typeof new_values != "string"
      ) {
        if (session == undefined) {
          model_name.updateMany(
            update_condition_obj,
            new_values,
            {
              runValidators: true,
            },
            (e, result) => {
              if (!e) {
                resolve(result);
              } else {
                let err_obj = {};
                for (var i in e.errors) {
                  if (e.errors[i].properties.message) {
                    err_obj[i] = e.errors[i].properties.message;
                  } else {
                    err_obj[i] = e.errors[i].stringValue;
                  }
                  // err_obj[i] = e.errors[i].properties.message;
                }
                reject(err_obj);
              }
            }
          );
        } else {
          model_name.updateMany(
            update_condition_obj,
            new_values,
            {
              runValidators: true,
              session: session,
            },
            (e, result) => {
              if (!e) {
                resolve(result);
              } else {
                let err_obj = {};
                for (var i in e.errors) {
                  if (e.errors[i].properties.message) {
                    err_obj[i] = e.errors[i].properties.message;
                  } else {
                    err_obj[i] = e.errors[i].stringValue;
                  }
                  // err_obj[i] = e.errors[i].properties.message;
                }
                reject(err_obj);
              }
            }
          );
        }
      } else {
        reject({
          status: 104,
          message: "Invalid parameters for update",
        });
      }
    });
  };

  findFromCollection = (model_name, query_obj = {}) => {
    return new Promise((resolve, reject) => {
      if (model_name != undefined && model_name != "") {
        model_name.find(query_obj, function (e, result) {
          if (!e) {
            resolve(result);
          } else {
            reject(e);
          }
        });
      } else {
        reject({
          status: 104,
          message: "Invalid search",
        });
      }
    });
  };

  deleteFromCollection = (model_name, query_obj, session) => {
    return new Promise((resolve, reject) => {
      if (model_name != undefined && model_name != "") {
        if (session == undefined) {
          model_name.deleteOne(query_obj, function (e, result) {
            if (!e) {
              resolve(result);
            } else {
              reject(e);
            }
          });
        } else {
          model_name.deleteOne(
            query_obj,
            {
              session: session,
            },
            function (e, result) {
              if (!e) {
                resolve(result);
              } else {
                reject(e);
              }
            }
          );
        }
      } else {
        reject({
          status: 104,
          message: "Invalid search",
        });
      }
    });
  };

  bulkwriteupdateone = (filter_query, update_obj) => {
    return {
      updateOne: {
        filter: filter_query,
        update: update_obj,
      },
    };
  };

  bulkwriteupdatemany = (filter_query, update_obj) => {
    return {
      updateMany: {
        filter: filter_query,
        update: update_obj,
      },
    };
  };
}

let database = new MandaliDatabase();
module.exports = database;
