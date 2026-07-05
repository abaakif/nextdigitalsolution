<?php

header('Content-Type: application/json'); // Set content type to JSON for AJAX response

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Include your database connection
    $servername = "localhost";
    $username = "u731809186_nextdigital";
    $password = "?X3;Lk#l";
    $dbname = "u731809186_nextdigital";

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die(json_encode([
            "alert" => "alert alert-danger alert-dismissable",
            "message" => "Connection failed: " . $conn->connect_error
        ]));
    }

    // Prepare and bind
    $stmt = $conn->prepare("INSERT INTO contacts (name, email, phone, subject, comment) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $name, $email, $phone, $subject, $comment);

    // Get form data
    $name = $_POST['name'];
    $email = $_POST['email'];
    $phone = $_POST['phone'];
    $subject = $_POST['subject'];
    $comment = $_POST['comment'];

    // Execute the query
    if ($stmt->execute()) {
        echo json_encode([
            "alert" => "alert alert-success alert-dismissable",
            "message" => "Your message has been recorded successfully!"
        ]);
    } else {
        echo json_encode([
            "alert" => "alert alert-danger alert-dismissable",
            "message" => "Error saving to database: " . $stmt->error
        ]);
    }

    // Close connections
    $stmt->close();
    $conn->close();
    
    // Now send the email
    if (!empty($email)) {
        $enable_smtp = 'yes';
        $receiver_email = 'info@nextdigitalsolution.com';
        $receiver_name = 'Next Digital Solution';
        $subject = 'Contact Form Submission';

        $fields = [];
        foreach ($_POST as $name => $value) {
            if (empty($value)) continue;
            $fields[$name] = nl2br(filter_var($value, FILTER_SANITIZE_SPECIAL_CHARS));
        }

        $message = '<html><body>';
        $message .= '<table>';
        foreach ($fields as $fieldname => $fieldvalue) {
            $message .= "<tr><td><strong>$fieldname:</strong></td><td>$fieldvalue</td></tr>";
        }
        $message .= '</table>';
        $message .= '</body></html>';

        if ($enable_smtp === 'no') {
            // Using simple mail() function
            $headers = "MIME-Version: 1.0\r\n";
            $headers .= "Content-type:text/html;charset=UTF-8\r\n";
            $headers .= 'From: ' . $fields['name'] . ' <' . $fields['email'] . '>\r\n';

            if (mail($receiver_email, $subject, $message, $headers)) {
                echo json_encode([
                    "alert" => "alert alert-success alert-dismissable",
                    "message" => "Your message has been sent successfully!"
                ]);
            } else {
                echo json_encode([
                    "alert" => "alert alert-danger alert-dismissable",
                    "message" => "Your message could not be sent!"
                ]);
            }
        } else {
            // Using PHPMailer with SMTP
            require 'phpmailer/Exception.php';
            require 'phpmailer/PHPMailer.php';
            require 'phpmailer/SMTP.php';

            $mail = new PHPMailer();
            $mail->isSMTP();
            $mail->Host = 'mx1.hostinger.com';
            $mail->SMTPAuth = true;
            $mail->Username = 'info@nextdigitalsolution.com';
            $mail->Password = '?X3;Lk#l';
            $mail->SMTPSecure = 'ssl';
            $mail->Port = 465;
            $mail->setFrom($fields['email'], $fields['name']);
            $mail->addAddress($receiver_email, $receiver_name);
            $mail->Subject = $subject;
            $mail->Body = $message;
            $mail->isHTML(true);

            if ($mail->send()) {
                echo json_encode([
                    "alert" => "alert alert-success alert-dismissable",
                    "message" => "Your message has been sent successfully!"
                ]);
            } else {
                echo json_encode([
                    "alert" => "alert alert-danger alert-dismissable",
                    "message" => "Your message could not be sent: " . $mail->ErrorInfo
                ]);
            }
        }
    } else {
        echo json_encode([
            "alert" => "alert alert-danger alert-dismissable",
            "message" => "Please provide an email address!"
        ]);
    }
}
?>
