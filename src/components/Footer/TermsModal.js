import { Box, Dialog, Grid, Typography } from "@mui/material";
import React from "react";
import styles from "./Footer.module.css";
import CloseIcon from "@mui/icons-material/Close";

const TermsModal = ({ dialogOpen, setDialogOpen }) => {
  const handleClose = () => {
    setDialogOpen(false);
  };
  return (
    <>
      <Dialog
        open={dialogOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "10px 12px 0px 14px",
          }}
        >
          <Typography style={{ fontWeight: "600" }}>Terms and Conditions</Typography>
        </Box>

        <CloseIcon
          style={{ cursor: "pointer", position: "absolute", top: "10px", right: "10px" }}
          onClick={handleClose}
        />
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          sx={{ p: 2 }}
        >
          <Typography className={styles.termsInnerHeading}>
            <b>Disclaimer and Acknowledgement</b>
          </Typography>
          <Typography className={styles.termsTypo}>
            This website (the Website) is managed and operated for and/or on behalf of the Risin
            Ventures (the Department). This Website is a community platform for individuals in Qatar
            to fund creative and/or commercial campaigns around the world.
            <br />
            The terms we, us or our(s) hereunder refer to the DEPARTMENT and its affiliates and the
            terms user, you and your hereunder refer to the users of this Website.
            <br />
            The term Content means the texts, documents, statements, information, photographs,
            videos, drawings, questions, answers, contact details, and any and all other materials
            of any nature whatsoever in whatever form or format which is available via this Website,
            created by us or by any third party (including any Campaigner (as defined further
            below)). Any words following the terms including, include, in particular or “for
            example” or any similar phrase shall be construed as illustrative and shall not limit
            the generality of the related general words.
            <br />
            These terms and conditions of use (the Terms of Use) explain the terms on which you may
            access and/or use this Website.
            <br />
            By accessing and/or using this Website, you hereby agree that you have read, understood
            and shall abide by all of the terms and conditions as set forth in these Terms of Use,
            which shall be binding on you.
            <br />
            Please note, if you choose to Contribute to any one or more Campaign (also called
            MANDATE) via this Website, such participation may be subject to separate terms that you
            may need to enter into with the relevant Campaigner (also termed as MANDATER)
            (capitalized terms as defined further below). If there is any conflict or inconsistency
            between a term of these Terms of Use and a term of any separate terms that you may need
            to enter into with the relevant Campaigner, the term of these Terms of Use shall prevail
            to the extent of such conflict or inconsistency.
            <br />
            Please also note our privacy policy that is set out on this Website (the Privacy
            Policy). The Privacy Policy explains how we collect, process and use your personal
            information. The Privacy Policy is subject to, and is incorporated by, reference into
            these Terms of Use (collectively, this Agreement).
            <br />
            You represent that you are of legal age to form a binding contract. You must be at least
            21 years old to be eligible to use this Website and either apply to list a Campaign or
            Contribute. If you are under 21 years of age, you may only use this Website subject to
            you obtaining the express consent of your parent or guardian who agrees to the terms of
            this Agreement.
            <br />
            If you do not agree to abide by this Agreement, please do not access or use this Website
            or apply to list a Campaign/MANDATE or Contribute. You are responsible for ensuring that
            all persons who access this Website through your internet connection are aware of this
            Agreement and other applicable terms and conditions and that they comply with them in
            all respects.
            <br />
            We provide you with a limited right to access and use this Website subject to the terms
            and conditions of this Agreement. You are not granted any ownership rights in the
            Website and/or Content.
            <br />
            <b style={{ color: "rgba(108, 25, 62, 1)" }}>Creating an account </b>
            <br />
            In order to fully access the Website and certain restricted parts of the Website you are
            required to register with us, which is done by following a sign-up process. Firstly, you
            will be asked to enter a public email ID and set up a password by submitting some basic
            details about yourself (including your name and email address) and shall be prompted to
            choose a unique username and password.
            <br />
            You will then be required at this point to submit detailed information about yourself
            and/or the Mandate you wish to apply for, as applicable. We will also require you to
            provide certain additional information if you are making an application for a Mandate,
            such as proof of identity, proof of your current address, copy of trade license (if
            applicable) and any other information as we deem appropriate. Applications to register a
            Mandate on the Website will be subject to an approval process (which includes reference
            and other background checks) and may be accepted or rejected at our sole discretion and
            without liability or any appeals process.
            <br />
            <b style={{ color: "rgba(108, 25, 62, 1)" }}> The Process: MANDATER</b>
            <br />
            Once a successful applicant is accepted by us to list a Mandater on the Website (
            MANDATER), the Mandater may seek pitches for its mandate ( PITCHES) and, as such, shall
            invite individual founders/startups to pitch ( STARTUPS and FOUNDERS shall be construed
            accordingly). Anyone who pitches towards a mandate will do so via the Website (and
            pursuant to this Agreement). Neither the Department nor the Website is or shall be a
            party to the above-mentioned pitch or results thereof. Rather, the Department (via the
            Website) is acting as facilitator, bringing together Startups and Mandate creators. The
            contract referred to above is a direct legal agreement between Mandate creators and
            Startups. However, in establishing such contract, the Mandate creator must ensure that
            none of the terms contained therein are inconsistent with the terms of this Agreement as
            this shall be considered a serious breach of this Agreement that may result in the
            Mandate being paused or even canceled. If a Mandate is canceled due to the foregoing,
            the Mandate creator shall be required to return all startup pitches received so far.
            <br />
            <b style={{ color: "rgba(108, 25, 62, 1)" }}>
              Here are some further terms that govern the Mandate:
            </b>
            <br />
            Throughout a Mandate, the Mandate creator must exhibit a high degree of application,
            diligence, effort, dedication, honesty and transparency. Startups acknowledge and agree
            that when they are making pitches, the Mandates may require new or novel products or
            services. As such, there could be unexpected changes or delays, as well as the
            possibility that a Mandate may not finish as promised. If a Mandate is not finished as
            promised and/or any related rewards (if applicable) remain unfulfilled, the Mandate
            creator must communicate this to the startups or founders who pitched. Such Mandate
            creator will have addressed such requirements only when the following apply: It has
            posted an update clearly explaining the extent of work undertaken to date, It clearly
            sets out and posts a remedial plan (including time frame), works diligently and in good
            faith to bring the Campaign to a successful conclusion; It has been transparent and
            honest, and has not made any misrepresentations in its communications to Contributors.
            Please see limitation of liability section below for more information on this. The
            Mandate creator is solely responsible for fulfilling the promises made in their
            Campaign.
            <br />
            <b style={{ color: "rgba(108, 25, 62, 1)" }}>Pitches and Process</b>
            <br />
            All Pitches for a mandate will be made via this Website. Upon the completion of a
            mandate, it is up to the mandate creator to deliver and fulfill any promises or rewards
            (if applicable) to startups. Any timelines in respect of completion of Mandates and, if
            applicable, delivery of any rewards is an estimate provided by the Mandate creator. This
            is not a guarantee to fulfill by that date and the timeline may change as the Mandate
            evolves. Mandate creators should only set dates that they are confident they can meet
            and should remain fully transparent and open with startups as to any changes in such
            dates.
            <br />
            <b style={{ color: "rgba(108, 25, 62, 1)" }}>
              {" "}
              Personal information and sensitive data
            </b>
            <br />
            The Mandate creator may require further information from a startup, for example a
            mailing address. However, Mandate creators are not permitted to request personal or
            sensitive personal information (including payment or credit card details) unless it is
            necessary to evaluate the pitch. Startups should never provide any personal or sensitive
            personal information (including payment or credit card details, or confidential product
            information) that is not necessary. The Department shall apply reasonable and
            appropriate security procedures in relation to data security and safeguarding and take
            reasonable precautions necessary to preserve and safeguard any personal or sensitive
            information provided by startups. Neither the Department nor the website takes any
            responsibility for a breach in respect of the above personal information provisions.
            <br />
            <b style={{ color: "rgba(108, 25, 62, 1)" }}>Content and the Campaigns</b>
            <br />
            The Content is for information only and is not intended to amount to advice on which you
            should rely. This Website may include Content or links of, or from, third parties (e.g.
            Events), including in relation to Mandates. We do not endorse or guarantee the accuracy,
            reliability or appropriateness of any opinion, statement, information or material of any
            third party (including the Mandate creators) uploaded to, linked to or posted on this
            Website, including in relation to a Mandate. You acknowledge that by using this Website
            you may be exposed to information that is inaccurate or unreliable and in this respect
            your use of this Website and your reliance on the Content (including any such third
            party information or material) as well as any pitch made towards a mandate is entirely
            at your own risk. As a Startup you acknowledge and agree that you are making a pitch
            towards a mandate and that, as such, there may not be any return (monetary or otherwise)
            nor guarantee of any such return unless the Mandate creator expressly states otherwise
            to you. It is up to the startup to make an assessment of the merits and risks associated
            with any pitch and mandate to which such a pitch relates. Nothing contained in the
            Website is intended, nor should it be assumed, to constitute a recommendation by the
            Department or any of the Department’s affiliates in respect of any Mandate. As stated in
            these Terms of Use, the Department and the Website are simply acting as facilitators to
            bring together Mandate creators and Startups. Pitches are made entirely at the startup’s
            risk. As a Mandate creator you acknowledge and agree that neither the Department, any of
            its affiliates nor the website guarantees that a Mandate will achieve its target. As
            stated above, the Department and the website are acting as facilitators to bring
            together Contributors and Campaigners. Any application for and listing of a mandate on
            the Website is done entirely at the mandate creator’s risk. We will not have any
            responsibility or liability for the conduct of any user on or through this Website and
            we assume no responsibility or liability for any lack of disclosure of data, mistakes,
            misstatements of law, defamation, libel, omissions, opinions, representations or
            anything else contained in any Content or in any information or materials that are
            provided by any third party (including mandate creators). We will not have any
            responsibility or liability for any application, registration or on-boarding process for
            this Website or any mandate, the selection or shortlisting process for any mandate, the
            awarding of any mandate or for information that you provide through this Website or that
            you share with any third party (including with any mandate creator). We assume no
            responsibility or liability for any on-boarding, selection, shortlisting or awarding
            process(es) in relation to a mandate or the lack of disclosure of data, mistakes,
            misstatements of law, defamation, libel, omissions, acts, opinions, representations or
            anything else that is provided or made by any third parties (including any startup). We
            reserve the right, but disclaim any obligation, to monitor Content from users of this
            Website, or take any action to restrict any access to material displayed or distributed
            through this Website that violates this Agreement. Any Content you upload to the Website
            will be considered non-confidential and non-proprietary. You retain all of your
            ownership rights in your Content, but you are required to grant us a perpetual,
            irrevocable, worldwide and royalty-free license to use, store and copy that Content and
            to distribute and make it available to third parties (including to potential mandate
            creators). If any Content is provided to us or via this Website, you hereby grant the
            above license to us and consent for us to use, store, copy, share and distribute your
            Content for such purposes. You are solely responsible for securing and backing up your
            Content. We also have the right to disclose your identity to any third party who is
            claiming that any Content posted or uploaded by you to our Website constitutes a
            violation of their Intellectual Property Rights (as defined herein) or of their right to
            privacy. The startups agree that (i) any information and Content provided by them on
            this Website and in relation to any mandate is, at any given time, correct, accurate and
            not misleading and (ii) they must ensure any updates to such information and Content are
            posted on the Website without delay.
            <br />
            <b style={{ color: "rgba(108, 25, 62, 1)" }}>System Requirements</b>
            <br />
            We do not guarantee this Website will be bug or virus free nor do we guarantee any
            minimum uptime or service levels in relation to this Website. From time to time this
            Website may be updated in accordance with the relevant sections set out below. Depending
            on the update, you may not be able to use this Website (or any part thereof). Please see
            the Intellectual Property Rights section below for further information on how you are
            permitted to make use of this Website and the Content.
            <br />
            <b style={{ color: "rgba(108, 25, 62, 1)" }}> Links</b>
            <br />
            If you have registered on this Website or accessed this Website via a link or connection
            (including plug-ins or like applications) from another website owned or operated by a
            third party (including social media platforms), please be informed that we have no
            control over such third party links, connections (including plug-ins or like
            applications), information or website(s) and we are not responsible or liable for its
            content and make no representations about (or in any way endorse) any material or
            services available at or from such third party website (including login or registration
            access). Such link or connection (including plug-ins or like applications) does not
            imply sponsorship, affiliation or endorsement by us of the third party or the third
            party website. We do not in any way guarantee that such links or connections (including
            plug-ins or like applications) will be up to date, free from any errors, inaccuracies or
            omissions or be fit for any purpose.
            <br />
            <b style={{ color: "rgba(108, 25, 62, 1)" }}> No Warranties or Endorsements</b>
            <br />
            This Website is provided subject to all of the terms and conditions of this Agreement.
            To the fullest extent permitted by law, we exclude all conditions, warranties,
            representations or other terms which may otherwise apply to this Website, the Mandates
            and the Content whether express or implied. We do not warrant that this Website or the
            Content (or any part thereof) will be: Constantly available, or available at all;
            Correct, complete, true, suitable, up to date or accurate Free of defects or errors.
            This Website may contain Content uploaded or otherwise provided by or related to third
            parties, including Mandate creators.
            <br />
            Such Content is not in any way endorsed by us and does not constitute the opinion or
            advice or services of us. We in no way make any representation, warranty or undertaking
            in respect of such Content or any Campaign.
            <br />
            <b style={{ color: "rgba(108, 25, 62, 1)" }}>
              Limitation of Liability and Indemnification
            </b>
            <br />
            The use of this Website and reliance on the Content is entirely at your own risk and in
            no event shall we nor any of our affiliates be liable (whether under the law, breach of
            statutory duty or otherwise) for any direct, indirect, incidental, consequential,
            special, exemplary, punitive or any other monetary or other damages, fees, fines,
            penalties or liabilities, nor for any loss or disclosure of data or loss or damage to
            reputation or goodwill (collectively Damage) whatsoever (even if such Damage is
            foreseeable) arising out of or relating to the use or inability to use this Website or
            for any reliance on this Website or the Content, including in respect of any failure by
            a Contributor and/or Campaigner to deliver on any commitment to provide Contributions or
            complete a Campaign (respectively) or for any other reason whatsoever. Your sole and
            exclusive remedy for dissatisfaction with this Website and/or the Content is to stop
            using this Website and/or Content. We will not be liable for any loss or damage caused
            by any virus, distributed denial-of-service attack or other technologically harmful
            material that may affect or infect your computer, equipment, computer projects, data,
            tablet or mobile devices or other proprietary material due to your use of this Website
            or to your downloading of any Content on this Website or the use or downloading of any
            information or materials of any other website linked to this Website or by reason of any
            disclosure of such material or data by any third party.
            <br />
            You agree to defend, indemnify and hold us, and our affiliates, officers, directors,
            employees, representatives, successors, assigns and agents (and their licensors,
            advertisers, suppliers, and operational service providers) harmless from and against any
            and all claims, expenses, costs, actions, demands, liabilities, judgments and
            settlements (including reasonable legal fees) resulting from or alleged to result from
            your use of this Website, the Content and/or any violation of the terms of this
            Agreement.
            <br />
            We reserve the right to assume the exclusive defense and control of any demand, claim or
            action arising hereunder or in connection with this Website and all negotiations for
            settlement or compromise. You agree to fully cooperate with us in the defense of any
            such demand, claim, action, settlement or compromise negotiations, as requested by us.
            Neither we, nor any of our affiliates, assumes liability or responsibility for any
            Content or services supplied by you or any third parties (including mandate creators)
            nor for the Content of any other websites linked or carrying a link to this Website.
            This Website is provided on an “as is” and “as available” basis. We do not make any
            warranty, and disclaim all responsibility and liability for the availability,
            timeliness, security, reliability, quality of this Website, any related software, or
            other products, services, information or Content obtained through this Website. We have
            no responsibility or liability for the deletion of, or the failure to store or to
            transmit, any Content and other information maintained or transmitted by this Website.
            We are not responsible for the accuracy or reliability of any information or Content
            transmitted through this Website. We may, at any time, limit your use or discontinue
            this Website (or any aspect thereof) entirely at our sole discretion with no liability
            to you.
            <br />
            <b style={{ color: "rgba(108, 25, 62, 1)" }}> Intellectual Property Rights</b>
            <br />
            We own or are the licensee of all Intellectual Property Rights in this Website and the
            Content which are protected by the laws of Qatar and international copyright, trademark
            and/or patent laws and treaties. All such rights are reserved. All trademarks, service
            marks and trade names are owned, registered and/or licensed by us. You are not permitted
            to make any use of any of our trademarks, services marks or trade names. No part of the
            protected materials available on or in this Website (including any Content) may be
            copied, reproduced, translated or reduced to any electronic medium without prior written
            permission.
            <br />
            The term Intellectual Property Rights means any and all current and/or future
            intellectual property rights, including all forms of copyright and authors rights,
            computer and software code, scripts, patents, design elements, graphics, logos,
            interactive features, artwork, text communication, brand names, trademarks, service
            marks, rights in trade dress or get-up, goodwill, domain names, website addresses (URL),
            know-how, trade secret, rights to sue for passing off, unfair competition rights, moral
            rights and any other content that may be found on or in this Website created by us or on
            our behalf.
            <br />
            <b style={{ color: "rgba(108, 25, 62, 1)" }}>
              Enforcement and protection of Intellectual Property Rights
            </b>
            <br />
            If we discover that you have used any materials on this Website protected by
            Intellectual Property Rights belonging to us or others in contravention of the terms of
            the license below or otherwise in breach of our rights or this Agreement, we and any of
            our affiliates may bring legal proceedings against you, seeking monetary damages and an
            injunction, or any other equitable remedies, against you. You could also be ordered to
            pay legal fees and costs. If you become aware of any use of materials in which we own or
            are the licensee of Intellectual Property Rights and that contravenes or may contravene
            the terms of this Agreement, you agree to immediately report this by email to
            contact@arisio.io
            <br />
            <b style={{ color: "rgba(108, 25, 62, 1)" }}>Limited License</b>
            <br />
            In consideration of you agreeing to abide by the terms of this Agreement, we grant to
            you a non-transferable, non-exclusive, royalty-free and revocable license to: Use this
            Website as herein set forth Copy and store this Website in your web browser cache
            memory; Print pages from this Website for your own personal and non-commercial use. You
            must not modify the paper or digital copies of any materials you have printed or
            downloaded in any way, and you must not use any illustrations, photographs, video or
            audio sequences or any graphics separately from any accompanying text. We do not grant
            to you any other rights whatsoever in relation to this Website. All other rights are
            expressly reserved by us. You acknowledge and agree that the rights to access and use
            this Website are licensed (not sold) to you, and that you have no rights in, or to, this
            Website other than the right to use it in accordance with the terms of this Agreement.
            You acknowledge that you have no right to have access to this Website in source-code
            form. You agree that we cannot license you to make use of Content generated by third
            parties and to which we do not have any rights of ownership or sub-licensing rights. You
            undertake not to gain or attempt to gain any access to any aspect of this Website or the
            Content which you are not authorized to access under the terms and conditions of this
            Agreement.
            <br />
            <b style={{ color: "rgba(108, 25, 62, 1)" }}>License Restrictions</b>
            <br />
            You may use this Website and the Content subject always to terms and conditions of this
            Agreement. You agree in relation to this Website and the Content (and for each of them):
            Not to copy them, except where such copying is incidental to normal use, or where it is
            necessary for the purpose of back-up or operational security Not to rent, lease,
            sub-license, loan, translate, merge, adapt, vary or modify them Not to make alterations
            to, or modifications of, the whole or any part of them, or permit them or any part of
            them to be combined with, or become incorporated in, any other mandates Not to alter,
            destroy, obscure, or otherwise remove any copyright or proprietary notices or labels
            contained within them Not to disassemble, decompile, reverse-engineer, or otherwise
            attempt to gain access to the source code of them or create derivative works based on
            the whole or any part of them or attempt to do any such thing Not to provide or
            otherwise make them available in whole or in part (including object and source code), in
            any form to any person without prior written consent from us Not to use them in any
            unlawful manner, for any unlawful purpose, or in any manner inconsistent with this
            Agreement, or act fraudulently or maliciously, for example, by hacking into or inserting
            malicious code, including viruses, or harmful data, into any of them or any operating
            system Not to infringe our Intellectual Property Rights or those of any third party in
            relation to your use of them (to the extent that such use is not licensed by this
            Agreement) or in relation to any Content or information that you may provide through
            this Website Not provide or publish any content or information that: Defames others, is
            obscene, abusive, discriminatory, offensive, hateful or inflammatory Promotes or incites
            violence or illegal activities Not to collect or harvest any information or data from
            them or our systems or attempt to decipher any transmissions to or from the servers
            running them Not to use any automated data collection methods, data mining, robots, or
            scraping or any data gathering methods of any kind in relation to, or in connection
            with, them
            <br />
            <b style={{ color: "rgba(108, 25, 62, 1)" }}>No Unlawful or Prohibited Use</b>
            <br />
            You agree not to in any way make use of this Website and/or any of the Content in any
            unauthorized manner or in violation of any local, federal or international laws or
            regulations. We reserve the right at all times to revoke or restrict your access to this
            Website in our sole discretion for any other reason whatsoever.
            <br />
            <b style={{ color: "rgba(108, 25, 62, 1)" }}>Monitoring</b>
            <br />
            We reserve the right to collect and use anonymous non-personal information pertaining to
            your use of this Website, including to anonymously track and report to our third party
            statistical service providers your activity involving this Website. By using this
            Website, you consent to us collecting and using your technical information, including
            the software, hardware and peripherals, to improve this Website and to provide any
            services to you.
            <br />
            <b style={{ color: "rgba(108, 25, 62, 1)" }}> Termination of Use</b>
            <br />
            We may, in our sole discretion, terminate or suspend your access to and use of this
            Website without notice, and for any reason, including violation of this Agreement or
            other conduct which we, in our sole discretion, believe is unlawful or harmful to us or
            others. In the event of termination, you will no longer be authorized to access or use
            this Website and we will use any means available or necessary to enforce this
            termination.
            <br />
            <b style={{ color: "rgba(108, 25, 62, 1)" }}>Access and Passwords</b>
            <br />
            If you choose, or you are provided with, a user identification code, password or any
            other piece of information as part of our security procedures, you must treat such
            information as confidential. You must not disclose it to any third party. We have the
            right to disable any user identification code or password, whether chosen by you or
            allocated by us, at any time, if in our reasonable opinion you have failed to comply
            with any of the provisions of this Agreement. If you know or suspect that anyone other
            than you knows your user identification code or password, you must promptly notify us at
            contact@arisio.io
            <br />
            <b style={{ color: "rgba(108, 25, 62, 1)" }}> Changes to this Agreement</b>
            <br />
            We reserve the right, without any liability to you, to modify this Agreement without
            notice and at any time. Updated versions of this Agreement will appear on this Website
            and are effective immediately. You are responsible for regularly reviewing this
            Agreement and your continued use of this Website following any modifications to this
            Agreement will be deemed as acceptance of any such modifications to this Agreement. If
            you do not accept and abide by the terms of this Agreement or any modification to it,
            you may not use this Website or download or use any of the Content. Your use of this
            Website is at your sole risk and liability.
            <br />
            <b style={{ color: "rgba(108, 25, 62, 1)" }}>Changes to this Website and Content</b>
            <br />
            We may update or alter this Website from time to time (including all Content) at any
            time. The Content on this Website may be out of date at any given time, and we are under
            no obligation to update it (or any part thereof). We do not in any way guarantee that
            our Website or any Content will be up to date, free from any errors, inaccuracies or
            omissions or be fit for any purpose.
            <br />
            <b style={{ color: "rgba(108, 25, 62, 1)" }}> Applicable Law</b>
            <br />
            This Agreement and your use of this Website is governed by and shall be construed in
            accordance with the laws of Qatar. Such laws will govern these disclaimers, terms and
            conditions and this Agreement, without giving effect to any principles of conflicts of
            laws. We reserve the right to make changes to this Agreement, and our Website at any
            time. You hereby irrevocably submit to the jurisdiction of the Courts of Qatar in
            relation to all disputes relating to this Website and this Agreement. If any provision
            of this Agreement is, or is found to be, unenforceable under any applicable law, that
            will not affect the enforceability of the other provisions of this Agreement.
            <br />
            <b style={{ color: "rgba(108, 25, 62, 1)" }}>
              Notification of Objectionable Content and Take - Down
            </b>
            <br />
            If you wish to object to any Content on this Website, please do so immediately upon
            becoming aware of objectionable Content and in writing to contact@arisio.io. Please
            ensure you clearly identify the Content objected to and detailing the basis for your
            objection and the action(s) you request we take in relation to such Content and provide
            your full contact details to enable us to discuss with you and act appropriately upon
            any such objection. We will in all reasonable cases attempt to investigate objections
            and, if appropriate, remove the relevant Content. However, as set out above, we are not
            in any way liable for any third party service providers.
            <br />
            Contact Us
            <br />
            To contact us, please send your email to{" "}
            <b style={{ color: "rgba(108, 25, 62, 1)" }}>contact@arisio.io</b>
            <br />
            <b style={{ color: "rgba(108, 25, 62, 1)" }}>Copyright</b>
            <br />
            This Website and its Content are subject to copyright. All rights reserved. You may not,
            except with our express written permission, distribute or commercially exploit this
            Website or the Content.
          </Typography>
        </Grid>
      </Dialog>
    </>
  );
};

export default TermsModal;
