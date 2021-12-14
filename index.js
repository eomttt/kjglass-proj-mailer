const nodemailer = require('nodemailer');

const config = require('./mail.config');

const SEND_TO_MAIL = 'hyunt0413@gmail.com';

const transporter = nodemailer.createTransport({
  service: config.mailer.service,
  auth: {
    user: config.mailer.user,
    pass: config.mailer.pass,
  },
});

const translateMail = (data) =>
  new Promise((resolve, reject) => {
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
      from: 'FROM < hyunt0413@naver.com >',
      to: SEND_TO_MAIL,
      subject: '견적 문의',
      html: `<div><b>제목: ${title}</b></div>
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
               )}</div>`,
    };

    transporter.sendMail(mailOptions, (err, res) => {
      if (err) {
        console.log('failed... => ', err);
        reject(err);
      } else {
        console.log('succeed... => ', res);
        resolve(res);
      }

      transporter.close();
    });
  });

module.exports.translateMail = translateMail;
