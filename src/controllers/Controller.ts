import { NextFunction, Response } from "express";
import { appDataSource } from "../db";
import { BaseEntity, EntityTarget, ObjectLiteral, Repository } from "typeorm";
import { ErrorHandler, APIResponse } from "../core";
import { prettyError } from "../utils";
/**
 * Controller Class
 */

interface IFailedProps {
  err: any;
  next: NextFunction;
  statusCode?: number;
}
export abstract class Controller<T extends ObjectLiteral = BaseEntity> {
  protected repository: Repository<T>;

  constructor(Entity: EntityTarget<T>) {
    this.repository = appDataSource.getRepository(Entity);
  }

  protected getRepository = <U extends ObjectLiteral>(
    Entity: EntityTarget<U>
  ) => appDataSource.getRepository(Entity);

  /**
   *
   * @param res Response Object from express
   * @param data Response body
   * @param status Response Status
   * @param message Response Message
   */
  protected success = <T>(
    res: Response<APIResponse>,
    data?: T,
    status = 200,
    message?: string
  ) => {
    res.status(status).json({
      status,
      success: true,
      message,
      data,
    });
  };

  public failed = ({ err, statusCode = 404 }: IFailedProps) => {
    throw new ErrorHandler(prettyError(err), statusCode);
  };

  /**
   *
   * @param enumObject -- Typescript Native Enume
   * @param type -- Key of Enum
   */
  protected isValidEnum<T>(
    enumObject: T extends { [key: string]: any } ? T : never,
    type: keyof T
  ) {
    const isValid = Object.values(enumObject).includes(type as any);

    if (!isValid) {
      const err = `${type.toString()} should be one of ${Object.values(
        enumObject
      )}`;

      throw new ErrorHandler(err, 404);
    }
  }

  protected validateErr = <
    TBody extends Record<string, any>,
    K extends keyof TBody,
  >(
    body: TBody,
    ...arr: K[]
  ) => {
    const errMessage: string[] = [];
    arr.forEach((item) => {
      if (body instanceof Array) {
        for (const obj of body) {
          if (!obj[item]) {
            errMessage.push(`${item.toString()} is required`);
          }
        }
      } else {
        if (!body[item]) {
          errMessage.push(`${item.toString()} is required`);
        }
      }
    });

    if (errMessage.length) {
      throw new ErrorHandler(errMessage.join(", "), 404);
    }
  };
}
