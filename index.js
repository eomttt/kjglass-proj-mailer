import nodemailer from "nodemailer";

const SEND_TO_MAIL = process.env.SEND_TO_MAIL;

const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

const translateMail = (data, callback) => {
  const { contactData, item } = data;
  const { title, company, team, name, email, number, faxNum, content } =
    contactData;
  const { glass, expendables } = item;

  const glassInfoItems = glass.map((glassData) => {
    const { url, count, selectedSpecificItem } = glassData;
    const { number: catalogNumber } = selectedSpecificItem;
    return `<div><div>URL: ${url}</div><div>카타로그 번호: ${catalogNumber}</div><div>주문 갯수: ${count}</div></div><br>`;
  });

  const expendableItems = expendables.map((expendableData) => {
    const { url, count, selectedSpecificItem } = expendableData;
    const { number: catalogNumber } = selectedSpecificItem;
    return `<div><div>URL: ${url}</div><div>카타로그 번호: ${catalogNumber}</div><div>주문 갯수: ${count}</div></div><br>`;
  });

  const mailOptions = {
    from: `FROM <div ${process.env.MAIL_USER} >`,
    to: SEND_TO_MAIL,
    subject: "견적 문의",
    html: `<div><b style="color:orange;font-size:20px">주의: !!이메일에 있는 이메일 값을 복사해서 답장해주세요!!</b>
            <br />
            <br />
            <b>제목: ${title}</b>
             <br>
             <div>회사: ${company}</div>
             <br>
             <div>부서: ${team}</div>
             <br>
             <div>담당자: ${name}</div>
             <br>
             <div>이메일: ${email}</div>
             <br>
             <div>전화번호: ${number}</div>
             <br>
             <div>팩스: ${faxNum}</div>
             <br>
             <div>내용: ${content}</div>
             <br>
             <br>
             <div><b>제품 상세</b></div>
             <br>
             <div><b>광진이 화학 제품군</b></div>
             <div>${glassInfoItems.map((glassItem) => glassItem)}</div>
             <br>
             <div><b>기타 화학 제품군</b></div>
             <div>${expendableItems.map(
               (expendableItem) => expendableItem
             )}</div></div>`,
  };

  transporter.sendMail(mailOptions, (err, res) => {
    if (err) {
      const response = {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          error: err.message,
        }),
      };
      callback(null, response);
      return;
    }

    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: `Email sent successfully!!!`,
      }),
    };
    callback(null, response);
  });
};

export const handler = (event, context, callback) => {
  translateMail(JSON.parse(event.body), callback);
};
