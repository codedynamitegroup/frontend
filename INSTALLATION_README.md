# Hướng dẫn cài đặt hệ thống hỗ trợ sinh viên rèn luyện kỹ năng lập trình có tích hợp AI và thông tin trang web được dũng sẵn

## Mục lục
- [Hướng dẫn cài đặt hệ thống hỗ trợ sinh viên rèn luyện kỹ năng lập trình có tích hợp AI và thông tin trang web được dũng sẵn](#hướng-dẫn-cài-đặt-hệ-thống-hỗ-trợ-sinh-viên-rèn-luyện-kỹ-năng-lập-trình-có-tích-hợp-ai-và-thông-tin-trang-web-được-dũng-sẵn)
  - [Mục lục](#mục-lục)
  - [Các bước cài đặt và triển khai hệ thống](#các-bước-cài-đặt-và-triển-khai-hệ-thống)
    - [Cài đặt các thư viện và công cụ cần thiết](#cài-đặt-các-thư-viện-và-công-cụ-cần-thiết)
    - [Các bước cài đặt và triển khai hệ thống](#các-bước-cài-đặt-và-triển-khai-hệ-thống-1)
      - [Docker](#docker)
      - [Keycloak](#keycloak)
      - [Judge0](#judge0)
      - [Database](#database)
      - [Kafka](#kafka)
      - [Redis](#redis)
      - [Backend](#backend)
      - [Frontend](#frontend)
  - [Thông tin về trang web được dựng sẵn và các tài khoản với các vai trò:](#thông-tin-về-trang-web-được-dựng-sẵn-và-các-tài-khoản-với-các-vai-trò)
    - [Thông tin về trang web được dựng sẵn](#thông-tin-về-trang-web-được-dựng-sẵn)
    - [Thông tin các tài khoản](#thông-tin-các-tài-khoản)


## Các bước cài đặt và triển khai hệ thống

### Cài đặt các thư viện và công cụ cần thiết

Để có thể triển khai hệ thống ở môi trường phát triển, người dùng cần phải cài đặt các thư viện và công cụ cần thiết sau:

- Git CLI: [https://git-scm.com/downloads](https://git-scm.com/downloads)
- Docker CLI & Docker Desktop: [https://docs.docker.com/engine/install/](https://docs.docker.com/engine/install/)
- Nodejs: [https://nodejs.org/en/download/prebuilt-installer/current](https://nodejs.org/en/download/prebuilt-installer/current)
- Helm: [https://helm.sh/docs/intro/install/](https://helm.sh/docs/intro/install/)
- Navicat: [https://www.navicat.com/en](https://www.navicat.com/en)
- Project Github Repository: [https://github.com/codedynamitegroup/backend-programming-learning-system-infra.git](https://github.com/codedynamitegroup/backend-programming-learning-system-infra.git)

### Các bước cài đặt và triển khai hệ thống

Sau khi đã tải và cài đặt các thư viện và công cụ cần thiết, người dùng cần phải cài đặt và triển khai các hệ thống theo thứ tự sau ở môi trường phát triển:

#### Docker

Đầu tiên cần mở Docker Desktop và vào phần Settings, sau đó vào phần Kubernetes và chọn lựa chọn “Enable Kubernetes” sau đó bấm “Apply & Restarts". Lúc này Docker sẽ tự động khởi động một cụm Kubernetes mini bao gồm:

- Một nút master: Quản lý cụm và lưu trữ trạng thái của nó.
- Một hoặc nhiều nút worker: Chạy các container của bạn.

#### Keycloak

Để khởi chạy hệ thống Keycloak, đầu tiên cần vào đường dẫn đã tải repository backend-programming-learning-system-infra, ở đây giả sử đường dẫn chứa repository này là “/infra". 

Các bước để tiến hành chạy Keycloak:

1. Mở công cụ terminal và gõ `cd /infra/backend-programming-learning-system-infra/my_helms` và nhấn Enter.
2. Gõ `kubectl apply -f keycloak/postgres_keycloak.yml` và nhấn Enter.
3. Gõ `kubectl apply -f keycloak/dev/keycloak-local.yml` và nhấn Enter.
4. Tiếp theo cần mở ứng dụng Navicat và kết nối vào cơ sở dữ liệu Postgres của Keycloak với các thông số sau:
    - Host: localhost
    - Port: 5432
    - Database: keycloak
    - Username: keycloak
    - Password: password
5. Xoá tất cả các bảng trong cơ sở dữ liệu keycloak và sử dụng tệp tên “keycloak.sql” ở đường dẫn `/infra/backend-programming-learning-system-infra/my_helms/keycloak/keycloak.sql`
6. Tiếp tục gõ vào terminal `kubectl delete -f keycloak/dev/keycloak-local.yml` và nhấn Enter.
7. Gõ vào terminal `kubectl apply -f keycloak/dev/keycloak-local.yml` và nhấn Enter.
8. Lúc này hệ thống Keycloak đã được cài đặt và triển khai ở môi trường phát triển thành công. Người dùng có thể truy cập vào trang web “localhost:8080” để vào trang chủ của Keycloak.

#### Judge0

- Điều kiện: Đã cài đặt Docker CLI
1. Tải và giải nén bằng lệnh sau
    ```sh
    wget https://github.com/judge0/judge0/releases/download/v1.13.0/judge0-v1.13.0.zip
    unzip judge0-v1.13.0.zip
    ```
2. Chạy tất cả các dịch vụ cho đến khi mọi thứ hoàn tất
    ```sh
    cd judge0-v1.13.0
    docker-compose up -d db redis
    sleep 10s
    docker-compose up -d
    sleep 5s
    ```
3. Gán env của frontend 
    ```sh
    REACT_APP_GATEWAY_SERVICE_API_URL = http://localhost:80
    ```

#### Database

Các bước để tiến hành cài đặt và triển khai cơ sở dữ liệu của hệ thống:

1. Mở công cụ terminal và gõ `cd /infra/backend-programming-learning-system-infra/my_helms` và nhấn Enter. 
2. Gõ `kubectl apply -f postgres_database/postgres-database-deployment.yml` và nhấn Enter.
3. Mở ứng dụng Navicat và kết nối với cơ sử dữ liệu Postgres với các thông số sau:
    - Host: localhost
    - Port: 5439
    - Database: postgres
    - Username: postgres
    - Password: localdb
4. Tạo lần lượt 4 cơ sở dữ liệu sau “auth-service”, “core-service”, “code-assessment-service”, “course-service”. Lúc này cơ sở dữ liệu đã sẵn sàng được sử dụng bởi các microservice trong hệ thống.

#### Kafka

Lúc này chúng ta cần phải chạy Kafka để có thể truyền và nhận sự kiện giữa các microservice. Các bước để cài đặt và triển khai Kafka:

1. Mở công cụ terminal và gõ `cd /infra/backend-programming-learning-system-infra/my_helms` và nhấn Enter. 
2. Gõ `helm install gke-confluent-kafka kafka/cp-helm-charts --version 0.6.0` và nhấn Enter.
3. Gõ `kubectl apply -f kafka/kafka-client.yml` và nhấn Enter. Tiếp tục Gõ `kubectl exec -it kafka-client -- /bin/bash` và nhấn Enter. Lúc này chúng ta có thể chạy lệnh để tạo các chủ đề sẵn cho Kafka.
4. Vào đường dẫn `/infra/backend-programming-learning-system-infra/my_helms/kafka` và copy tệp tên `create-topics.sh`. Sau đó cần dán lệnh sql này vào terminal ở bước trên và nhấn Enter. Chúng ta đợi cho tới khi lệnh được thực thi hoàn thành và chúng ta có thể gõ `exit` để thoát khỏi terminal của kafka-client. Lúc này, kafka đã sẵn sàng được sử dụng bởi hệ thống.

#### Redis

Tiếp đến chúng ta cần phải chạy Redis để có thể sử dụng lưu dữ liệu vào bộ nhớ đệm cũng như sử dụng cho kỹ thuật Rate Limiting ở gateway service. Các bước để cài đặt và triển khai Redis:

1. Mở công cụ terminal và gõ `cd /infra/backend-programming-learning-system-infra/my_helms` và nhấn Enter. 
2. Gõ `helm repo add bitnami https://charts.bitnami.com/bitnami` và nhấn Enter để có thể thêm kho lưu trữ Bitnami vào danh sách các kho lưu trữ của Helm.
3. Gõ `helm install redis bitnami/redis -f redis/values.yaml` và nhấn Enter. Lúc này Redis đã sẵn sàng để sử dụng. 

#### Backend

Chúng ta đã cài đặt và triển khai các hệ thống cần thiết cho việc triển khai hệ thống Backend. Tiếp theo sẽ là các bước để cài đặt và triển khai hệ thống Backend:

1. Mở công cụ terminal và gõ `cd /infra/backend-programming-learning-system-infra/my_helms` và nhấn Enter. 
2. Gõ `helm install datn-backend environments/dev-env` và nhấn Enter. Lúc này chúng ta đã hoàn thành việc cài đặt và triển khai hệ thống backend thành công.

#### Frontend

Cuối cùng sẽ là các bước để cài đặt và triển khai hệ thống Frontend:

1. Tải repository của frontend tại: [https://github.com/codedynamitegroup/frontend](https://github.com/codedynamitegroup/frontend)
2. Mở terminal và gõ lệnh `npm i`
3. Gán các biến env tại tập tin .env
    ```sh
    PORT=3000
    REACT_APP_CLOUDINARY_PRESET=fiwp8e1e
    REACT_APP_CLOUDINARY_NAME=doofq4jvp
    REACT_APP_GOOGLE_GEMINI_AI_KEY=AIzaSyCzF7o3Z3RTO8Bqo6s18Yj18WyFeqZrvVM
    REACT_APP_CODE_PLAGIARISM_DETECTION_API_URL=http://localhost:4000/api/v1
    REACT_APP_GOOGLE_CLIENT_Id=132336113026-k11rr8icghmocc6ve3e84rsvr3q5apum.apps.googleusercontent.com
    REACT_APP_MICROSOFT_CLIENT_Id=e5bc1d80-da68-470f-8fe5-732a71a3a23d
    REACT_APP_MICROSOFT_REDIRECT_URL=http://localhost:${PORT}
    REACT_APP_CORE_SERVICE_API_URL=http://localhost:80
    REACT_APP_AUTH_SERVICE_API_URL=http://localhost:80
    REACT_APP_CODE_ASSESSMENT_SERVICE_API_URL=http://localhost:80
    REACT_APP_COURSE_SERVICE_API_URL=http://localhost:80
    REACT_APP_SOCKET_SERVICE_API_URL=ws://127.0.0.1:8085
    REACT_APP_JUDE0_URL = http://localhost:2358
    REACT_APP_GATEWAY_SERVICE_API_URL=http://localhost:80
    ```
4. Gõ `npm run start`, nhấn Enter và chờ một lúc. Lúc này chúng ta đã hoàn thành việc cài đặt và triển khai hệ thống frontend thành công.

Lúc này, người dùng có thể mở trình duyệt và truy cập vào đường dẫn localhost:3000 người dùng sẽ thấy hệ thống trang ứng dụng hỗ trợ sinh viên rèn luyện kỹ năng lập trình có tích hợp AI.

## Thông tin về trang web được dựng sẵn và các tài khoản với các vai trò:

### Thông tin về trang web được dựng sẵn

**Tên:** Hệ thống hỗ trợ sinh viên rèn luyện kỹ năng lập trình có tích hợp AI  
**Đường dẫn trang web:** [https://codedynamite.site](https://codedynamite.site)

### Thông tin các tài khoản

- **Tài khoản:** ndqkhanh852@gmail.com  
  **Mật khẩu:** Hh123456@  
  **Role:** Người dùng bình thường

- **Tài khoản:** nguyenquoctuan385@gmail.com  
  **Mật khẩu:** Hh123456@  
  **Role:** Sinh viên

- **Tài khoản:** kayonkiu@gmail.com  
  **Mật khẩu:** Hh123456@  
  **Role:** Giảng viên

- **Tài khoản:** dcthong852@gmail.com  
  **Mật khẩu:** Hh123456@  
  **Role:** Quản trị viên hệ thống

- **Tài khoản:** tgtien852@gmail.com  
  **Mật khẩu:** Hh123456@  
  **Role:** Quản trị viên tổ chức
