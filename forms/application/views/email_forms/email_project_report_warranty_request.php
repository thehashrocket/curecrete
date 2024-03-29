<!DOCTYPE html>
<!--[if lt IE 7]>
<html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>
<html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>
<html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!-->
<html class="no-js"> <!--<![endif]-->
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title></title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width">

    <!-- Place favicon.ico and apple-touch-icon.png in the rroot directory -->

    <link rel="stylesheet" href="/forms/assets/css/normalize.css">
    <link rel="stylesheet" href="/forms/assets/css/main.css">
    <link rel="stylesheet" href="http://code.jquery.com/ui/1.10.2/themes/smoothness/jquery-ui.css">
    <link rel="stylesheet" href="/forms/assets/css/custom-theme/jquery-ui-1.10.2.custom.min.css">
    <script src="/forms//assets/js/vendor/modernizr-2.6.2.min.js"></script>
</head>
<body class="pdf">
<!--[if lt IE 7]>
<p class="chromeframe">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade
    your browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">activate Google Chrome Frame</a> to
    improve your experience.</p>
<![endif]-->

<div role="main" id="wrapper">

<div id="content" class="warranty">


    <div id="header">
        <table style="width: 750px;">
            <tr>
                <td style="width: 80px; vertical-align: top;">
                    <img src="/forms/assets/img/Curecrete-Logo_120x169.png" style="margin-right: 10px; height: 100px; width: 71px">
                </td>
                <td style="width: 150px; vertical-align: top;">
                    <div class="title">
                        <h1 style="font-size: 2em; line-height: 1.75em; color: #000000; font-weight: bold;">Project Report &amp; <br/> Warranty Request</h1>
	                    <p>&nbsp;</p>
	                    <p><strong>Time Stamp (UTC): </strong> <?php echo date('Y-m-d, H:i:s'); ?></p>
	                    <p><strong>Date Submited: </strong> <?php echo date('m-d-Y'); ?></p>
	                    <p><strong>Customer Unique Form ID: </strong><?php echo $formid; ?></p>

                    </div>
                </td>
                <td style="width: 20px;">&nbsp;</td>
                <td style="vertical-align: top; width: 130px">
                    <p><strong>For Office Use Only</strong></p>
                    <table style="font-size: .75em;">
                        <tr>
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
                        </tr>
                        <tr>
                            <td>Job #:</td>
                            <td style="width: 70px; border-bottom: 1px solid #D3D3D3"></td>
                        </tr>
                        <tr>
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
                        </tr>
                        <tr>
                            <td><?php if($domesticProjectCheck == '&#x2611;') {echo '<span>ft<sup>2</sup>/gal</span>';} else {echo '<span>m<sup>2</sup>/L</span>';} ?>:</td>
                            <td style="width: 70px; border-bottom: 1px solid #D3D3D3"></td>
                        </tr>
                        <tr>
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
                        </tr>
                        <tr>
                            <td>Invoice #:</td>
                            <td style="width: 70px; border-bottom: 1px solid #D3D3D3"></td>
                        </tr>
                    </table>
                </td>
                <td style="vertical-align: top; width: 150px">
                    <table style="font-size: .75em; margin-top: 15px;">
                        <tr>
                            <td><input type="checkbox"></td>
                            <td>Job Posted in MAS</td>
                        </tr>
                        <tr>
                            <td><input type="checkbox"></td>
                            <td>Notes in MAS</td>
                        </tr>
                        <tr>
                            <td><input type="checkbox"></td>
                            <td>Distributor Authorized</td>
                        </tr>
                        <tr>
                            <td><input type="checkbox"></td>
                            <td>Invoice/Drum #s Match</td>
                        </tr>
                        <tr>
                            <td><input type="checkbox"></td>
                            <td>Invoice Paid</td>
                        </tr>
                        <tr>
                            <td><input type="checkbox"></td>
                            <td>5 Year Labor Warranty (From Distributor)</td>
                        </tr>
                        <tr>
                            <td><input type="checkbox"></td>
                            <td>20 &amp; 5 Year</td>
                        </tr>
                        <tr>
                            <td><input type="checkbox"></td>
                            <td>Lifetime &amp; 5 Year Labor</td>
                        </tr>
                        <tr>
                            <td><input type="checkbox"></td>
                            <td>Lifetime Product &amp; Labor</td>
                        </tr>
                    </table>
                </td>

            </tr>
        </table>

    </div>



    <div id="headerCheckboxes" style="margin-top: 30px;">
        <table style="font-size: 1em; width: 750px;">
            <tr>
                <td><?php echo $projectReportOnlyCheck; ?></td>
                <td><label for="projectReportOnlyCheck">Project Report ONLY</label><br/></td>
	            <td style="border-left: 1px solid #ccc"></td>
	            <td><?php echo $ashfordFormulaCheck; ?></td>
	            <td><label for="ashfordFormulaCheck">Ashford Formula</label><br/></td>
	            <td style="border-left: 1px solid #ccc"></td>
                <td><?php echo $domesticProjectCheck; ?></td>
                <td><label for="domesticProjectCheck">Domestic Project</label><br/></td>
            </tr>
            <tr>
	            <td ><?php echo $warrantyRequestCheck; ?></td>
	            <td ><label for="warrantyRequestCheck">Warranty Request</label><br/></td>
	            <td style="border-left: 1px solid #ccc; "></td>
	            <td style=""><?php echo $retroplateCheck; ?></td>
	            <td style=""><label for="retroplateCheck">Retroplate</label><br/></td>
	            <td style="border-left: 1px solid #ccc; "></td>
	            <td style=""><?php echo $internationalProjectCheck; ?></td>
	            <td style=""><label for="internationalProjectCheck">International Project</label><br/></td>
            </tr>
	        <tr><td style="border-bottom: 1px solid #ccc" colspan="8"></td> </tr>
	        <tr style="height: 40px" >
		        <td style="height: 40px"><?php echo $leedNominatedCheck; ?></td>
		        <td style="height: 40px" colspan="7"><label style="height: 40px" for="leedNominatedCheck">Will this project be applying for a LEED Award or any other “Green” distinctions?</label><br/>
		        </td>
	        </tr>
	        <tr><td style="border-bottom: 1px solid #ccc" colspan="8"></td> </tr>
        </table>

</div>

    <div id="headerTextFields" style="font-size: .75em; margin-top: 10px;">
        <table style="font-size: 1em; width: 750px;">
            <tr>
                <td class="label" style="width: 180px; background-color: #D3D3D3; padding-left: 5px;">
	                <label for="distributorName"><?php if($domesticProjectCheck == '&#x2611;') {echo 'Customer/Rep Submitting Form';} else {echo 'Distributor Submitting Form<sup>*</sup>';} ?></label>
	                <br/>
                </td>
                <td><?php echo $distributorName; ?></td>
                <td class="label" style="width: 120px; background-color: #D3D3D3; padding-left: 5px;">
	                <label for="distributorEmail"><?php if($domesticProjectCheck == '&#x2611;') {echo 'Customer/Rep Email<sup>*</sup>';} else {echo 'Distributor Email<sup>*</sup>';} ?></label>
	                <br/>
                </td>
                <td><?php echo $distributorEmail; ?></td>
                <td class="label" style="width: 45px; background-color: #D3D3D3; padding-left: 5px;"><label for="poNumber">PO #</label><br/></td>
                <td><?php echo $poNumber; ?></td>
            </tr>

        </table>
</div>

    <table id="projectInformation" style="width: 750px;">

        <tr>
            <th colspan="5" style="background-color: #000000; color: #ffffff; text-align: center; height: 25px;">
                <p style="text-transform: uppercase">Project Information</p>
            </th>
        </tr>
        <tr>
            <td class="label" style="padding-left: 5px; width: 175px; background-color: #D3D3D3;"><label for="projectName">Project Name<sup>*</sup></label></td>
            <td class="input"><?php echo $projectName; ?></td>
            <td class="label" style="width: 180px; background-color: #D3D3D3;"><label for="amountUsed"><?php if($domesticProjectCheck == '&#x2611;') {echo '<span>Gallons</span>';} else {echo '<span>Liters</span>';} ?> Used<sup>*</sup></label> </td>
            <td class="input"><?php echo $amountUsed; ?> </td>
        </tr>
        <tr>
            <td class="label" style="padding-left: 5px; width: 175px; background-color: #D3D3D3;"><label for="address">Address<sup>*</sup></label></td>
            <td class="input"><?php echo $address; ?></td>
            <td class="label" style="padding-left: 5px; width: 175px; background-color: #D3D3D3;"><label for="squareDistance"><?php if($domesticProjectCheck == '&#x2611;') {echo '<span>ft<sup>2</sup></span>';} else {echo '<span>m<sup>2</sup></span>';} ?><sup>*</sup></label> </td>
            <td class="input"><?php echo $squareDistance; ?> </td>
        </tr>
        <tr>
            <td class="label" style="padding-left: 5px; width: 175px; background-color: #D3D3D3;"><label for="city">City<sup>*</sup></label></td>
            <td class="input"><?php echo $city; ?></td>
            <td class="label" style="padding-left: 5px; width: 175px; background-color: #D3D3D3;"><label for="initialApplicationDate">Initial Application Date<sup>*</sup></label> </td>
            <td class="input"><?php echo $initialApplicationDate; ?> </td>
        </tr>
        <tr>
            <td class="label" style="padding-left: 5px; width: 175px; background-color: #D3D3D3;"><label for="state">Province/State<sup>*</sup></label></td>
            <td class="input"><?php echo $state; ?></td>
            <td class="label" style="padding-left: 5px; width: 175px; background-color: #D3D3D3;"><label for="finalApplicationDate">Final Application Date<sup>*</sup></label> </td>
            <td class="input"><?php echo $finalApplicationDate; ?> </td>
        </tr>
        <tr>
            <td class="label" style="padding-left: 5px; width: 175px; background-color: #D3D3D3;"><label for="postalCode">Postal Code</label></td>
            <td class="input"><?php echo $postalCode; ?></td>

            <td class="label" style="padding-left: 5px; width: 175px; background-color: #D3D3D3;"><label for="buildingUse">Building Use<sup>*</sup></label> </td>
            <td class="input">
                <?php echo $building_use; ?>
            </td>
        </tr>
        <tr>
            <td class="label" style="padding-left: 5px; width: 175px; background-color: #D3D3D3;"><label for="country">Country<sup>*</sup></label></td>
            <td class="input"><?php echo $country; ?></td>
            <td class="label" style="padding-left: 5px; width: 175px; background-color: #D3D3D3;"><label for="industry">Industry<sup>*</sup></label> </td>
            <td class="input"><?php echo $industry; ?> </td>
        </tr>
        <tr>
            <td class="label" style="padding-left: 5px; width: 175px; background-color: #D3D3D3;"><label for="projectOwner">Project Owner<sup>*</sup></label></td>
            <td class="input"><?php echo $projectOwner; ?></td>
            <td class="label" rowspan="5" style="padding-left: 5px; width: 175px; background-color: #D3D3D3;"><label for="comments">Comments</label> </td>
            <td class="input" rowspan="5"><p><?php echo $comments; ?></p></td>
        </tr>
        <tr>
            <td class="label" style="padding-left: 5px; width: 175px; background-color: #D3D3D3;"><label for="specifierArchitect">Specifier/Architect</label></td>
            <td class="input"><?php echo $specifierArchitect; ?></td>

        </tr>
        <tr>
            <td class="label" style="padding-left: 5px; width: 175px; background-color: #D3D3D3;"><label for="generalContractor">General Contractor</label></td>
            <td class="input"><?php echo $generalContractor; ?></td>
        </tr>
        <tr>
            <td class="label" style="padding-left: 5px; width: 175px; background-color: #D3D3D3;"><label for="applicator">Applicator<sup>*</sup></label></td>
            <td class="input"><?php echo $applicator; ?></td>
        </tr>
        <tr>
            <td class="label" style="padding-left: 5px; width: 175px; background-color: #D3D3D3;"><label for="flatWorker">Flat Worker / Sub-Contractor</label></td>
            <td class="input"><?php echo $flatWorker; ?></td>
        </tr>

    </table>

    <table id="drumInformation" style="width: 750px;">
        <tr>
            <th colspan="8" style="background-color: #000000; color: #ffffff; text-align: center; height: 25px;">

	            <p style="text-transform: uppercase"><span>Drum Information</span></p>
            </th>
        </tr>
        <tr class="labelRow">
            <td class="label" style="background-color: #D3D3D3; height: 30px; text-align: center;">
                <label style="height: 30px">Drum No.</label>
            </td>
            <td class="label" style="background-color: #D3D3D3; height: 30px; text-align: center;">
                <label style="height: 30px"><?php if($domesticProjectCheck == '&#x2611;') {echo '<span>Gallons</span>';} else {echo '<span>Liters</span>';} ?></label>
            </td>
            <td class="label" style="background-color: #D3D3D3; height: 30px; text-align: center;">
                <label style="height: 30px">Drum No.</label>
            </td>
            <td class="label" style="background-color: #D3D3D3; height: 30px; text-align: center;">
                <label style="height: 30px"><?php if($domesticProjectCheck == '&#x2611;') {echo '<span>Gallons</span>';} else {echo '<span>Liters</span>';} ?></label>
            </td>
            <td class="label" style="background-color: #D3D3D3; height: 30px; text-align: center;">
                <label style="height: 30px">Drum No.</label>
            </td>
            <td class="label" style="background-color: #D3D3D3; height: 30px; text-align: center;">
                <label style="height: 30px"><?php if($domesticProjectCheck == '&#x2611;') {echo '<span>Gallons</span>';} else {echo '<span>Liters</span>';} ?></label>
            </td>
            <td class="label" style="background-color: #D3D3D3; height: 30px; text-align: center;">
                <label style="height: 30px">Drum No.</label>
            </td>
            <td class="label" style="background-color: #D3D3D3; height: 30px; text-align: center;">
                <label style="height: 30px"><?php if($domesticProjectCheck == '&#x2611;') {echo '<span>Gallons</span>';} else {echo '<span>Liters</span>';} ?></label>
            </td>
        </tr>
        <?php
            if (count($drumdata) > 0) {

                $x = 1;

                echo '<tr style="border-bottom: 1px solid #000;">';



                foreach($drumdata as $key => $value) {

                    if ($x == 4) {

                        echo '<td style="border-left: 1px solid #000; border-bottom:1px solid #000; border-right: 1px solid #000; height:25px; width:75px; padding-left:5px;">' . $value['drumNumber'] . '</td>';
                        echo '<td class="size" style="height:25px; border-bottom:1px solid #000; border-right: 1px solid #000;width:80px;">' . $value['size'] . '</td>';
                        echo '</tr>';
                        echo '<tr>';

                        $x = 1;
                    } else {
                        echo '<td style="border-left: 1px solid #000; border-bottom:1px solid #000; border-right: 1px solid #000; height:25px; width:75px; padding-left:5px;">' . $value['drumNumber'] . '</td>';
                        echo '<td class="size" style="height:25px; border-bottom:1px solid #000;width:80px;">' . $value['size'] . '</td>';

                        $x = $x + 1;
                    }
                }
            }
        ?>

    </table>

    <table id="warrantyRequest" style="width: 750px">
        <tr>
            <th colspan="4" style="background-color: #000000; color: #ffffff; text-align: center; height: 25px;">
	            <p style="text-transform: uppercase"><span>Warranty Request</span></p>


            </th>
        </tr>
        <tr>
            <td class="label" style="padding-left: 5px; width: 175px; background-color: #D3D3D3;"><label for="dateFloorWarrantied">Date Floor To Be Warranted<sup>*</sup></label> </td>
            <td class="input"><?php echo $dateFloorWarrantied; ?></td>
            <td class="label" style="padding-left: 5px; width: 175px; background-color: #D3D3D3;"><label for="applicatorAddress">Address<sup>*</sup></label> </td>
            <td class="input"><?php echo $applicatorAddress; ?></td>
        </tr>
        <tr>
            <td class="label" style="padding-left: 5px; width: 175px; background-color: #D3D3D3;"><label for="applicatorCompany">Applicator Company Name<sup>*</sup></label> </td>
            <td class="input"><?php echo $applicatorCompany; ?></td>
            <td class="label" style="padding-left: 5px; width: 175px; background-color: #D3D3D3;"><label for="applicatorCity">City<sup>*</sup></label> </td>
            <td class="input"><?php echo $applicatorCity; ?></td>
        </tr>
        <tr>
            <td class="label" style="padding-left: 5px; width: 175px; background-color: #D3D3D3;"><label for="applicatorOwner">Applicator Owner Name<sup>*</sup></label> </td>
            <td class="input"><?php echo $applicatorOwner; ?></td>
            <td class="label" style="padding-left: 5px; width: 175px; background-color: #D3D3D3;"><label for="applicatorState">State/Province<sup>*</sup></label> </td>
            <td class="input"><?php echo $applicatorState; ?></td>
        </tr>
        <tr>
            <td class="label" style="padding-left: 5px; width: 175px; background-color: #D3D3D3;"><label for="applicatorPhone">Phone<sup>*</sup></label> </td>
            <td class="input"><?php echo $applicatorPhone; ?></td>
            <td class="label" style="padding-left: 5px; width: 175px; background-color: #D3D3D3;"><label for="applicatorPostal">Postal Code</label> </td>
            <td class="input"><?php echo $applicatorPostal; ?></td>

        </tr>
        <tr>
            <td class="label" style="padding-left: 5px; width: 175px; background-color: #D3D3D3;"><label for="applicatorFax">Fax</label> </td>
            <td class="input"><?php echo $applicatorFax; ?></td>
            <td class="label" style="padding-left: 5px; width: 175px; background-color: #D3D3D3;"><label for="applicatorCountry">Country<sup>*</sup></label> </td>
            <td class="input"><?php echo $applicatorCountry; ?></td>

        </tr>

    </table>

    <table id="warrantyRequest2" style="width: 750px;">
        <tr>
            <td class="label first" width="165" style="padding-left: 5px;  background-color: #D3D3D3;"><label for="environmentalConditions">Environmental Conditions During Concrete Pour (i.e. Enclosed Building)<sup>*</sup></label></td>
            <td class="input" colspan="5"><p><?php echo $environmentalConditions; ?></p> </td>
        </tr>
        <tr>
            <td class="label first" style="padding-left: 5px; width: 175px; background-color: #D3D3D3;"><label for="weatherConditions">Weather Conditions During Application<sup>*</sup></label></td>
            <td class="input" colspan="5"><p><?php echo $weatherConditions; ?></p> </td>
        </tr>
        <tr>
            <td class="label first" width="185" style="padding-left: 5px; background-color: #D3D3D3;"><label for="ashfordForulaCure">Ashford Formula Used As Cure?<sup>*</sup></label></td>
            <td class="input">
                <div class="checkbox">
                    <?php echo $ashfordForulaCureYes; ?>
                    <label for="ashfordForulaCureYes">Yes</label>
                </div><br/>
                <div class="checkbox">
                    <?php echo $ashfordForulaCureNo; ?>
                    <label for="ashfordForulaCureNo">No</label>
                </div>
            </td>
            <td rowspan="2" width="65" class="label" style="padding-left: 5px; background-color: #D3D3D3;">
                <label for="appliedToConcrete">Applied To Concrete?<sup>*</sup></label>
            </td>
            <td class="input" width="220">
                <div class="checkbox">
                    <?php echo $appliedOnExistingFloor; ?>
                    <label for="appliedOnExistingFloor">On Existing Floor?</label>
                </div>
            <br/>
                <div class="checkbox">
                    <?php echo $appliedAtTimeOfPlacement; ?>
                    <label for="appliedAtTimeOfPlacement">At Time Of Placement?</label>
                </div>
            </td>
            <td class="label" width="65" style="padding-left: 5px; background-color: #D3D3D3;">
                <label for="applicationSupervisedByDistributor">Application Supervised by Distributor?<sup>*</sup></label>
            </td>
            <td class="input">
                <div class="checkbox">
                    <?php echo $applicationSupervisedByDistributorYes; ?>
                    <label for="applicationSupervisedByDistributorYes">Yes</label>
                </div><br/>
                <div class="checkbox">
                    <?php echo $applicationSupervisedByDistributorNo; ?>
                    <label for="applicationSupervisedByDistributorNo">No</label>
                </div>
            </td>

        </tr>
        <tr>
            <td class="label" style="padding-left: 5px; width: 180px; background-color: #D3D3D3;">
                <label for="floorBurnished">Floor Burnished?<sup>*</sup></label>
            </td>
            <td class="input">
                <div class="checkbox">
                    <?php echo $floorBurnishedYes; ?>
                    <label for="floorBurnishedYes">Yes</label>
                </div><br/>
                <div class="checkbox">
                    <?php echo $floorBurnishedNo; ?>
                    <label for="floorBurnishedNo">No</label>
                </div>
            </td>
            <td>
                <div class="checkbox" id="hoursAfterPlacementCheckbox">
                    <?php echo $hoursAfterPlacementNumbers; ?>
                    <br/>
                    <label for="hoursAfterPlacement" id="">Hours After Placement</label>
                </div>
            </td>


            <td class="label" style="padding-left: 5px; width: 60px; background-color: #D3D3D3;">
                <label for="maintenanceBrochureGiven">Maintenance Brochure Given?<sup>*</sup></label>
            </td>
            <td class="input">
                <div class="checkbox">
                    <?php echo $maintenanceBrochureGivenYes; ?>
                    <label for="maintenanceBrochureGivenYes">Yes</label>
                </div><br/>
                <div class="checkbox">
                    <?php echo $maintenanceBrochureGivenNo; ?>
                    <label for="maintenanceBrochureGivenNo">No</label>
                </div>
            </td>
        </tr>
    </table>

    <table id="corporateProjects" style="width: 750px; ">
        <tr><th style="background-color: #000000; color: #ffffff; text-align: center; height: 35px; text-transform: uppercase"><p>Partnering Services Projects</p></th></tr>
        <tr>
            <td>
                <p><?php if ($corporateProjectsText == '') {
                        echo 'No details';
                    } else {
                        echo $corporateProjectsText;
                    } ?></p>
            </td>
        </tr>

    </table>

    <table id="photos" style="width: 750px;">

        <tr><td>
                <?php
                if (isset($files) && $files >= 1) {

                    echo '<p><strong>The following files were uploaded:</strong></p>';

                    foreach($files as $key) {
                        echo '<p>' . $key['file_name'] . '</p>';
                    }


                } else {
                    echo 'No Photos Submitted';
                }
                ?>
            </td>
        </tr>
    </table>


</div>


</div>

<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
<script>window.jQuery || document.write('<script src="/forms/assets/js/vendor/jquery-1.9.1.min.js"><\/script>')</script>
<script src="http://code.jquery.com/ui/1.10.2/jquery-ui.js"></script>
<script src="/forms/assets/js/plugins.js"></script>
<script src="/forms/assets/js/main.js"></script>

<!-- Google Analytics: change UA-XXXXX-X to be your site's ID. -->
<script>
    var _gaq = [
        ['_setAccount', 'UA-XXXXX-X'],
        ['_trackPageview']
    ];
    (function (d, t) {
        var g = d.createElement(t), s = d.getElementsByTagName(t)[0];
        g.src = '//www.google-analytics.com/ga.js';
        s.parentNode.insertBefore(g, s)
    }(document, 'script'));
</script>
</body>
</html>
