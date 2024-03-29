<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
if (!function_exists('create_pdf')) {

	function create_pdf($html_data, $file_name = "", $type = "D",$sendername='', $senderemail='', $photomessage='', $photouploaded='', $emailsubject='', $recipient="") {
		if ($file_name == "") {
			date_default_timezone_set('UTC');
			$file_name = 'report' . date('dMY');
		}
		require 'mpdf/mpdf.php';
		$mypdf = new mPDF();
		$stylesheet = file_get_contents(base_url('/assets/css/pdf.css'));
		$mypdf->WriteHTML($stylesheet,1);
		$mypdf->WriteHTML($html_data,2);

		if ($type == 'D') {
			// Send to Desktop
			$mypdf->Output($file_name, 'D');
		}

		if ($type == 'F') {
			// Send to File
			$mypdf->Output($file_name, 'F');
		}

		if ($type == 'S') {
			// Send as Email

			$message2 = '';

			$message2 = '<p>You have a new submission. The details are as follows:</p>';

			$content = $mypdf->Output($file_name, 'S');

			if ( ! write_file('./assets/uploads/' . $file_name . '.pdf', $content))
			{
				echo '<div style="display:none">Unable to write the file</div>';
			}
			else
			{
				echo '<div style="display:none">File written!</div>';
			}

			$content = chunk_split(base64_encode($content));
//			$mailto = 'Garrett.Soong@ashfordformula.com';

            if ($recipient != "") {

                $mailto = 'projectreports@curecrete.com';

            } else {

                $mailto = 'customercare@curecrete.com';

            }



//			$mailto = 'jasshultz@gmail.com';
			$from_name = 'Curecrete Postmaster';
			$from_mail = 'postmaster@curecrete.com';
			$replyto = 'postmaster@curecrete.com';
			$uid = md5(uniqid(time()));

            if ($emailsubject != '') {
                $subject = $emailsubject;
            } else {
                $subject = 'International Purchase Form Submission';
            }

			$message = '<html>' . $message2 . $html_data . '</html>';
			$filename = $file_name .'.pdf';

			$header = "From: ".$from_name." <".$from_mail.">\r\n";

            if ($photouploaded == '1') {
                $marketing = 'marketing@curecrete.com';

                $header .= "Bcc: $marketing\r\n";
            }

            $header .= "Reply-To: ".$replyto."\r\n";
			$header .= "MIME-Version: 1.0\r\n";
			$header .= "Content-Type: multipart/mixed; boundary=\"".$uid."\"\r\n\r\n";
			$header .= "This is a multi-part message in MIME format.\r\n";
			$header .= "--".$uid."\r\n";
			$header .= "Content-type:text/html; charset=iso-8859-1\r\n";
			$header .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
			$header .= $message."\r\n\r\n";
			$header .= "--".$uid."\r\n";
			$header .= "Content-Type: application/pdf; name=\"".$filename."\"\r\n";
			$header .= "Content-Transfer-Encoding: base64\r\n";
			$header .= "Content-Disposition: attachment; filename=\"".$filename."\"\r\n\r\n";
			$header .= $content."\r\n\r\n";
			$header .= "--".$uid."--";
			$is_sent = @mail($mailto, $subject, "", $header);

			// Send to Customer

			$message2 = '<p>Thank you for your submission.  The information submitted for your <strong>Project Report/Warranty Request</strong> is detailed below.</p>';

            $message2 .= $photomessage;


			$message = '<html>' . $message2 . $html_data . '</html>';

			$header = "From: ".$from_name." <".$from_mail.">\r\n";
			$header .= "Reply-To: ".$replyto."\r\n";
			$header .= "MIME-Version: 1.0\r\n";
			$header .= "Content-Type: multipart/mixed; boundary=\"".$uid."\"\r\n\r\n";
			$header .= "This is a multi-part message in MIME format.\r\n";
			$header .= "--".$uid."\r\n";
			$header .= "Content-type:text/html; charset=iso-8859-1\r\n";
			$header .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
			$header .= $message."\r\n\r\n";
			$header .= "--".$uid."\r\n";
			$header .= "Content-Type: application/pdf; name=\"".$filename."\"\r\n";
			$header .= "Content-Transfer-Encoding: base64\r\n";
			$header .= "Content-Disposition: attachment; filename=\"".$filename."\"\r\n\r\n";
			$header .= $content."\r\n\r\n";
			$header .= "--".$uid."--";

			$is_sent2 = @mail($senderemail, $subject, "", $header);

//			$mypdf->Output();

		}

	}

}