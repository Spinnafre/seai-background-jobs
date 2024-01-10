import { connections } from "../connection.js";
import { DATABASES } from "../databases.js";

export class DbNewsLetterRepository {
  async getNewsById(id) {
    const result = await connections.newsletter.raw(
      `
      SELECT 
          n."Id" ,
          n."Fk_Sender" ,
          n."Title" ,
          n."Description" ,
          n."Content" ,
          n."CreatedAt" ,
          n."UpdatedAt",
          s."Email" ,
          s."Organ" 
      FROM "${DATABASES.NEWSLETTER.NEWS}" n 
      INNER JOIN "${DATABASES.NEWSLETTER.SENDER}" s 
      ON s."Id" = n."Fk_Sender" 
      WHERE n."Id" = ?
    `,
      [id]
    );

    if (!result.rows.length) {
      return null;
    }

    const newsRow = result.rows[0];

    return {
      Id: newsRow.Id,
      Author: {
        Id: newsRow.Fk_Sender,
        Email: newsRow.Email,
        Organ: newsRow.Organ,
      },
      Title: newsRow.Title,
      Description: newsRow.Description,
      Data: newsRow.Content,
      CreatedAt: newsRow.CreatedAt,
      UpdatedAt: newsRow.UpdatedAt,
    };
  }

  async getSubscribers() {
    const result = await connections.newsletter.raw(
      `
            SELECT s."Email"  FROM "Subscriber" s 
    `
    );

    if (!result.rows.length) {
      return null;
    }

    const rows = result.rows;

    return rows.map((row) => {
      return {
        Email: row.Email,
      };
    });
  }
}
