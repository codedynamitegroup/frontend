import { Box } from "@mui/material";
import classes from "./styles.module.scss";
import TextEditor from "components/editor/TextEditor";
import { useState } from "react";
import Heading1 from "components/text/Heading1";

interface Props {}

const CourseCertificateIntroduction = (props: Props) => {
  const [description, setDescription] = useState<string>(
    `<div class="RawText_root__4tSYq"><h3>Tổng quan về ngôn ngữ C:</h3>
<ul>
<li><span>Ngôn ngữ C là một ngôn ngữ đã có mặt từ rất lâu,&nbsp;là ngôn ngữ mệnh lệnh được ra đời từ đầu thập niên 70.</span></li>
<li><span>Ngôn ngữ C là một ngôn ngữ cấu trúc và xếp vào loại ngôn ngữ bậc 3 (loại ngôn ngữ cao cấp hơn ngôn ngữ mã máy và thấp hơn ngôn ngữ hướng đối tượng – bậc 4).</span></li>
<li><span>Ngôn ngữ C không chỉ được ưa chuộng trong việc viết các ứng dụng. Mà còn là ngôn ngữ rất hiệu quả trong việc&nbsp;viết các&nbsp;phần mềm hệ thống.</span></li>
<li><span>Được phát triển ban đầu bởi Dennis Ritchie để phát triển hệ thống lập trình UNIX ở Bell Labs.</span></li>
<li><span>Những&nbsp;hệ điều hành&nbsp;lớn Windows, Linux,…đều chịu ảnh hưởng từ ngôn ngữ C.</span></li>
</ul>
<hr>
<h3>Ứng dụng của ngôn ngữ C:</h3>
<h4><span id="He_dieu_hanh">Hệ điều hành.</span></h4>
<p>Ngôn ngữ lập trình C có thể được sử dụng để thiết kế phần mềm hệ thống. Như là hệ điều hành và Trình biên dịch.&nbsp;Viết kịch bản hệ điều hành UNIX là mục đích chính của việc tạo ra C. Ngôn ngữ C là một phần không thể thiếu trong quá trình phát triển của nhiều hệ điều hành. Unix-Kernel, các tiện ích và ứng dụng hệ điều hành Microsoft Windows và một bộ phận lớn hệ điều hành Android đều đã được viết kịch bản trong C.</p>
<p><img style="display: block; margin-left: auto; margin-right: auto;" src="https://codelearnstorage.s3.amazonaws.com/Media/Default/Users/TuanLQ7/HaiZuka/C_HeDieuHanh.png" alt="" height="434" width="674"></p>
<h4><span id="Phat_trien_ngon_ngu_moi">Phát triển ngôn ngữ mới</span></h4>
<p>Ứng dụng thứ 2 của ngôn ngữ c đó là nó là cơ sở để phát triển ngôn ngữ mới. Bởi nó có&nbsp;ảnh hưởng trực tiếp hoặc gián tiếp đến sự phát triển của nhiều ngôn ngữ bao gồm C ++ là C với các lớp, C #, D, Java, Limbo, JavaScript, Perl, UNIX’s C Shell, PHP và Python và Verilog.&nbsp;Các ngôn ngữ này sử dụng C trong khả năng biến đổi: ví dụ, trong Python. C được sử dụng để xây dựng các thư viện chuẩn. Trong khi các ngôn ngữ khác như C ++, Perl và PHP có cấu trúc cú pháp và điều khiển dựa trên C. Chính vì vậy mà nó được mệnh danh là ” ông nội” của các ngôn ngữ lập trình.</p>
<h4><span id="Nen_tang_tinh_toan">Nền tảng tính toán</span></h4>
<p>Ngôn ngữ C thực hiện các thuật toán và cấu trúc dữ liệu nhanh chóng. Tạo điều kiện cho việc tính toán nhanh hơn trong các chương trình.&nbsp;Điều này đã cho phép sử dụng C trong các ứng dụng yêu cầu mức độ tính toán cao hơn như MATLAB và Mathematica.</p>
<h4><span id="He_thong_nhung">Hệ thống nhúng</span></h4>
<p>Các tính năng của C bao như là truy cập trực tiếp vào API phần cứng của máy, sự hiện diện của trình biên dịch C. Ngoài ra<span>&nbsp;</span><strong>lập trình C</strong>&nbsp;còn sử dụng tài nguyên xác định và phân bổ bộ nhớ động Đã làm cho ngôn ngữ C trở thành lựa chọn tối ưu cho các ứng dụng và trình điều khiển của các hệ thống nhúng.</p>
<h4><span id="Do_hoa_va_tro_choi">Đồ họa và trò chơi</span></h4>
<p>Ngoài các ứng dụng trên thì ngôn ngữ C còn được dùng trong đồ họa và lập trình game. Nó đã được sử dụng để&nbsp;&nbsp;phát triển một loạt các ứng dụng đồ họa và chơi game, như cờ vua, bóng nảy, bắn cung, v.v.</p>
<p>Như vậy ta có thể thấy rằng ngôn ngữ tuy đã xuất hiện từ lâu, nhưng những ứng dụng và sự phổ biến của nó còn rất lớn. Với những tính năng và ứng dụng rộng rãi,<span>&nbsp;</span>lập trình C&nbsp;vẫn là một “lão làng” trong ngành lập trình.</p>
<hr>
<h3>Học viên sẽ nhận được những gì trong khóa học:</h3>
<ul>
<li>Hiểu cách sử dụng ngôn ngữ C:
<ul>
<li>Biết cách thêm các thư viện.</li>
<li>Biết rõ cách khai báo biến.</li>
<li>Biết cách nhập xuất dữ liệu.</li>
</ul>
</li>
<li>Hiểu được cách hoạt động của vào lặp (Trong C cũng như các ngôn ngữ khác):
<ul>
<li>Vòng lặp for.</li>
<li>Vòng lặp while, do-while.</li>
</ul>
</li>
<li>Hiểu rõ cách cấu trúc cơ bản của một ngôn ngữ lập trình:
<ul>
<li>Cấu trúc mảng.</li>
<li>Cấu trúc chuỗi.</li>
</ul>
</li>
<li>Làm quen với một số giải thuật cơ bản,
<ul>
<li>Biết cách viết các hàm.</li>
<li>Làm quen với giải thuật đệ quy.</li>
</ul>
</li>
</ul>
<hr><hr>
<p>Bạn cũng có thể tìm hiểu sâu và ngôn ngữ C và ứng dụng của nó <a rel="noopener" href="https://vi.wikipedia.org/wiki/C_(ng%C3%B4n_ng%E1%BB%AF_l%E1%BA%ADp_tr%C3%ACnh)" target="_blank">Tại đây</a>.</p></div>`
  );

  return (
    <Box id={classes.introduction}>
      <Box id={classes.courseDescription}>
        <Heading1 colorname='--blue-600'>Sơ lược về khóa học</Heading1>
        <TextEditor value={description} onChange={setDescription} readOnly={true} />
      </Box>
    </Box>
  );
};

export default CourseCertificateIntroduction;
