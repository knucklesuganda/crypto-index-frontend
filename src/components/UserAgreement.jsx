import { Col, Typography } from "antd";
import { Modal } from "antd";


function TermsTitle(props){
    return <div>
        { props.space ? <br/> : null }
        <Typography.Text style={{ fontSize: "1.6em" }}>{props.children}</Typography.Text>
    </div>;
}

function TermsText(props){
    return <div>
        { props.space ? <br/> : null }
        <Typography.Text style={{
            fontWeight: props.bold ? "bold" : "normal",
            fontSize: "0.9em",
        }}>{props.children}</Typography.Text>
    </div>;
}


function userAgreementModal(){
    Modal.info({
        title: "Void Management website user agreement",
        width: "60%",
        okText: "I hereby agree to the terms and conditions",
        onOk: () => { localStorage.hasSigned = true; },
        bodyStyle: {
            background: "#0a0a0a",
            border: "1px solid #1f1f1f",
            boxShadow: "4px 4px 20px 0px rgba(255, 255, 255, 0.26)",
        },
        content: <Col style={{ marginTop: "2em", whiteSpace: "break-spaces", fontSize: "1.2em" }}>
            <TermsText bold>Effective Date: June 6, 2022</TermsText>
            <TermsText>
                Void.management is brought to you by Void Management LLC. Void.management provides information 
                and resources about the fundamentals of the decentralized non-custodial protocols called the 
                Void Management Protocols (the “Void Management” or “Protocol”).
                Void.management is not one of the available access points to the Void Management Protocols.
            </TermsText>


            <TermsText space bold>You are entering into a binding Agreement.</TermsText>

            <TermsText>
                BY ACCESSING OR USING OUR SERVICES, WHICH INCLUDE OUR VARIOUS WEBSITES, INCLUDING, 
                WITHOUT LIMITATION, VOID.MANAGEMENT (AND ANY RESPECTIVE SUBDOMAINS); APPLICATIONS 
                (COLLECTIVELY WITH ANY MATERIALS AND SERVICES AVAILABLE THEREIN, AND SUCCESSOR WEBSITE(S) 
                OR APPLICATION(S) THERETO, THE “SITE”), AND OTHER SERVICES THAT LINK TO THESE TERMS, AS WELL 
                AS ANY INFORMATION, TEXT, LINKS, GRAPHICS, PHOTOS, AUDIO, VIDEO, OR OTHER MATERIALS STORED, 
                RETRIEVED OR APPEARING THEREON, WHETHER ACCESSED THROUGH THE SITE OR OTHERWISE (COLLECTIVELY, 
                THE “SERVICES”), YOU ARE ENTERING INTO A BINDING AGREEMENT WITH US THAT INCLUDES THESE TERMS, 
                AND OTHER POLICIES REFERENCED HEREIN (COLLECTIVELY, THE “AGREEMENT”).
                To the extent that there is a conflict between these Terms and any applicable additional terms, 
                these Terms will control unless expressly stated otherwise. If you don't agree with these Terms, 
                you may not use the Services and should not visit the Site or otherwise engage with the Services.
            </TermsText>

            <TermsTitle space>Use of the Services</TermsTitle>
            <TermsText>
                To use the Services, you must legally be able to enter into the Agreement. By using the Services, 
                you represent and warrant that you meet the eligibility requirement. If you do not meet the requirement,
                you must not access or use the Site or the Services.
                We may update the Services and the Terms.
                We may update the Services, the Agreement, and any part of the Terms at any time,
                for any reason, at our sole discretion. Once any part of the Agreement is updated and in effect,
                you will be bound by the Terms if you continue to use the Services,
                including by accessing the Site. We may, at any time, and without liability to you, modify or
                discontinue all or part of the Services (including access to the Services via any third-party links).
                You may contact us with questions about your use of the Services at info@void.management.
                When you communicate with us electronically, you consent to receive communications from
                us electronically. You should review the Terms from time to time to ensure that you
                understand the terms and conditions that apply to you when you access or use the Site.
            </TermsText>

            <TermsTitle space>Services</TermsTitle>
            <TermsText bold>Void.management is provided as an informational resource.</TermsText>
            <TermsText>
                Void.management provides resources about the fundamentals of the Void Management Protocols,
                which are fully decentralized protocols deployed on single or multiple blockchain networks and systems,
                and provides information about the wider Void Management ecosystem, community, and various interfaces
                and integrations to the Void Management Protocols. All information provided in connection with your
                access and use of the Site and the Services is for informational purposes only. You should not take,
                or refrain from taking, any action based on any information contained on the Site or any other information
                that we make available at any time, including blog posts, data, articles, links
                to third-party content, twitter content, news feeds, tutorials, tweets, and videos.

                Before you make any financial, legal, technical, or other decisions involving the Services,
                you should seek independent professional advice from a licensed and qualified individual in the area
                for which such advice would be appropriate. The Services provide, or third parties may provide, links
                to other sites, applications, or resources. You acknowledge and agree that we are not responsible for
                the availability of such external sites, applications or resources, and do not endorse and are not
                responsible or liable for any content, advertising, products, or other materials on or available
                from such sites or resources.

                You further acknowledge and agree that we will not be responsible or liable, directly or indirectly,
                for any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any such content,
                goods, or services available on or through any such site or resource. Because the Site
                provides information about the Void Management Protocols, these Terms also provide some information
                about the use of the Protocols. This information is not intended to be comprehensive
                or address all aspects of the Protocols.

                It is important to understand that neither we nor any affiliated entity is a party to any
                transaction on the blockchain networks underlying the Void Management Protocols; we do not have possession,
                custody or control over any cryptoassets appearing on the Services; and we do not have possession, custody,
                or control over any user’s funds. Further, we do not store, send, or receive any cryptoassets.
                The private key associated with the wallet address from which you transfer cryptoassets or the private key
                associated is the only private key that can control the cryptoassets you transfer into the smart contracts.
                You alone are responsible for securing your private keys. We do not have access to your private keys.
                Due to the non-custodial and decentralized nature of the technology, we are not intermediaries, agents,
                advisors, or custodians, and we do not have a fiduciary relationship or obligation to you regarding any other
                decisions or activities that you affect when using our Services. You acknowledge that we, for the avoidance
                of doubt, do not have any information regarding any users, users’ identities, or services beyond what is
                available or obtainable publicly via the blockchain. We are not responsible for any activities you engage
                in when using Services, and you should understand the risks associated with cryptoassets,
                blockchain technology generally, and our Services.
            </TermsText>

            <TermsText bold space>
                The Void Management Protocols are deployed on multiple blockchain-based networks,
                and we are not responsible for the operation of such networks.
            </TermsText>

            <TermsText>
                The software underlying blockchain networks on which the Void Management Protocols are deployed,
                including, for example, the Ethereum blockchain, is open source, which means that anyone can use,
                utilize, and build on top of it. By using the Services, you acknowledge and agree
                <br />(i) that we are not responsible for the operation of the blockchain-based software
                and networks underlying the Void Management Protocols,
                <br />(ii) that there exists no guarantee of the functionality, security, or availability of that
                software and networks, and
                <br />(iii) that the underlying blockchain-based networks are subject to sudden changes in operating rules,
                such as those commonly referred to as “forks”.
            
                <br />Transactions on the blockchain are not anonymous.
                A widespread belief is that transactions involving blockchains are anonymous. In fact,
                a central feature of blockchains and thus, blockchain-based transactions, are that they are transparent.
                Your public key and your wallet address, which you need to buy or sell items
                on the blockchain, are visible to anyone. To the extent your public key or wallet address can be
                linked back to you, it would be possible for someone to determine your identity and the
                cryptoassets you own.

                <br />There may be associated blockchain fees.
                All transactions using blockchains require the payment of gas fees, which are essentially
                transaction fees paid on every transaction that occurs on the selected blockchain network.
                Please note that gas fees are non-refundable. We do not provide any services
                to users or deliver, hold, and/or receive payment for cryptoassets.
                We do not receive any fees for any transactions, the Services, or the Site.
            </TermsText>

            <TermsTitle space>
                Assumption of Risk
            </TermsTitle>

            <TermsText>
                You assume the risks of engaging in transactions that rely on smart contracts
                and other experimental technology.
                Transactions on the Void Management Protocols rely on smart contracts stored on various blockchains,
                cryptographic tokens generated by the smart contracts, and other nascent software,
                applications and systems that interact with blockchain-based networks.
                These technologies are experimental, speculative, inherently risky, and subject to change.
                Among other risks, bugs, malfunctions, cyberattacks, or changes to the applicable blockchain
                (e.g., forks) could disrupt these technologies and even result in a total loss of cryptoassets,
                their market value, or digital funds. You are solely responsible for the safekeeping of
                the private key associated with the blockchain address used to interact with the Protocol.
                We assume no liability or responsibility for any such risks. If you are not comfortable assuming
                these risks, you should not access or engage in transactions using blockchain-based technology.

                One of the other defining features of blockchain technology is that its entries are immutable, which means,
                as a technical matter, they generally cannot be deleted or modified by anyone.
                This includes smart contracts and cryptoassets generated and programmed by smart contracts.
                THUS, TRANSACTIONS RECORDED ON THE BLOCKCHAIN, INCLUDING TRANSFERS OF CRYPTOASSETS AND DATA
                PROGRAMMED INTO THESE ASSETS (SUCH AS REVENUE AND INTEREST ALLOCATIONS), MUST BE TREATED AS PERMANENT
                AND CANNOT BE UNDONE BY US OR BY ANYONE. YOU MUST BE VERY CAREFUL WHEN YOU FINALIZE ANY
                TRANSACTION THAT WILL BE RECORDED ON THE BLOCKCHAIN.

                <br />We are not liable for any third-party services or links.
                We are not responsible for the content or services of any third-party, including,
                without limitation, any network, or apps like Twitter, or MetaMask,
                and we make no representations regarding the content or accuracy of any third-party services or materials.
                The user interface available at void.management can only be accessed through this website.
                We are not responsible for any action or omission taken by third-party service as it pertains
                to the user interface or otherwise. The use and access of any third-party products or services,
                including through the Services, is at your own risk.
            </TermsText>

            <TermsText bold space>
                You agree to the automated collection and disbursement of proceeds by smart contracts.
                You acknowledge and agree that all transactions accessed through the Services will be automatically
                processed using one or more blockchain-based smart contracts. By engaging in transactions using
                the Services, you acknowledge and consent to the automatic processing of all transactions in connection
                with using the Services. You further acknowledge and agree that the applicable smart contract will
                dictate how the funds of a transaction and ownership of cryptoassets are distributed.
                You acknowledge the risks of using the Services.You bear sole responsibility for evaluating the
                Services before using them, and all transactions accessed through the Services are irreversible,
                final, and without refunds. The Services may be disabled, disrupted or adversely impacted as a
                result of sophisticated cyber-attacks, surges in activity, computer viruses, and/or other
                operational or technical challenges, among other things. We disclaim any ongoing obligation
                to notify you of all of the potential risks of using and accessing our Services. You agree to
                (defined below) accept these risks and agree that you will not seek to hold any Void Management LLC
                responsible for any consequent losses.
            </TermsText>

            <TermsText>
                You are solely responsible for the security of your wallet. You understand and agree that you are
                solely responsible for maintaining the security of your wallet. Any unauthorized access to your
                wallet by third parties could result in the loss or theft of any cryptoasset, or any funds held in
                your account and any associated accounts. You understand and agree that we have no involvement in,
                and you will not hold us responsible for managing and maintaining the security of your wallet. You
                further understand and agree that we are not responsible, and you will not hold us accountable,
                for any unauthorized access to your wallet. It is your responsibility to monitor your wallet.
            </TermsText>

            <TermsText space bold>
                We reserve the right to restrict your access from engaging with the Services.
            </TermsText>

            <TermsText>
                You agree that we have the right to restrict your access to the Services
                via any technically available methods if we suspect, in our sole discretion, that
                <br />(a) you are using the Services for money laundering or any illegal activity;
                <br />(b) you have engaged in fraudulent activity;
                <br />(c) you have acquired cryptoassets using inappropriate methods, including the use of stolen
                funds to purchase such assets; or
                <br />(d) you have otherwise acted in violation of these Terms. If we have a reasonable
                suspicion that you are utilizing the Site for illegal purposes,
                we reserve the right to take whatever action we deem appropriate.
            </TermsText>

            <TermsText bold space>We do not guarantee the quality or accessibility of the Services.</TermsText>
            <TermsText>
                As a condition to accessing or using the Services or the Site, you acknowledge,
                understand, and agree that from time to time, the Site and the Services may be
                inaccessible or inoperable for any reason, including, but not limited to equipment malfunctions,
                periodic maintenance procedures or repairs, causes beyond our control or that we
                could not reasonably foresee, disruptions and temporary or permanent unavailability of underlying
                blockchain infrastructure or unavailability of third-party service providers or external partners for any reason.
                You acknowledge and agree that you will access and use the Services, including, without limitation,
                the Site at your own risk. You should not engage in blockchain-based transactions unless it is
                suitable given your circumstances and financial resources. By using the Services,
                you represent that you have been, are and will be solely responsible for
                conducting your own due diligence into the risks of a transaction and the
                underlying smart contracts and cryptoassets.
            </TermsText>

            <TermsTitle space>Taxes</TermsTitle>
            <TermsText bold>
                You are responsible for your taxes and duties. Users bear sole responsibility for paying any and all
                taxes, duties, and assessments now or hereafter claimed or imposed by any governmental authority
                associated with their use of the Services, and/or payable as the result of using and/or
                exploiting any cryptoassets and interacting with smart contracts.
                Blockchain-based transactions are novel, and their tax treatment is uncertain.
            </TermsText>

            <TermsTitle space>The Services</TermsTitle>
            <TermsText bold>We grant you the right to use our Services.</TermsText>
            <TermsText>
                Contingent upon your ongoing compliance with the Agreement, we grant you a personal, worldwide,
                revocable, non-exclusive and non-assignable right to use the software provided to you as
                part of our Services. The only purpose of this right is to allow you to use and enjoy the
                Services solely as permitted by these Terms.
            </TermsText>

            <TermsText bold>We own all rights in the Services.</TermsText>
            <TermsText>
                We own any and all right, title, and interest in and to the Services including,
                without limitation, any and all copyrights in and to any content, code, data,
                or other materials that you may access or use on or through the Services.
                Except as expressly set forth herein, your use of or access to the Services does
                not grant you any ownership or other rights therein.
            </TermsText>

            <TermsText bold>We may use and share your feedback.</TermsText>
            <TermsText>
                Any comments, bug reports, ideas, or other feedback that you may provide about our Services, including
                suggestions about how we might improve our Services, are entirely voluntary.
                You agree that we are free to use or not use any feedback that we receive from you as we see fit,
                including copying and sharing such feedback with third parties, without any obligation to you.
            </TermsText>

            <TermsText bold>Prohibited Content</TermsText>
            <TermsText>
                You may only use the Services if you comply with this Agreement (including, without limitation,
                these Terms),
                applicable third-party policies, and all applicable laws, rules, regulations and related guidance.
            </TermsText>

            <TermsText>The following conduct is prohibited:</TermsText>
            <TermsText>
                <ul>
                <li>
                    using the Services for, or to promote or facilitate, illegal activity
                    (including, without limitation, money laundering, financing terrorism,
                    tax evasion, buying or selling illegal drugs, contraband, counterfeit goods,
                    or illegal weapons);
                </li>
                
                <li>exploiting the Services for any unauthorized commercial purpose;</li>
                
                <li>
                    uploading or transmitting viruses, worms, Trojan horses, time bombs, cancel bots,
                    spiders, malware or any other type of malicious code 
                    that will or may be used in any way that will affect the functionality
                    or operation of the Services;
                </li>

                <li>
                    attempting to or actually copying or making unauthorized use of all or any portion of the Services,
                    including by attempting to reverse compile, reformatting or framing,
                    disassemble, reverse engineer any part of the Services;
                </li>

                <li>
                    harvesting or otherwise collecting information from the
                    Services for any unauthorized purpose;
                </li>

                <li>
                    using the Services under false or fraudulent pretenses
                    or otherwise being deceitful;
                </li>

                <li>interfering with other users’ access to or use of the Services;</li>

                <li>
                    interfering with or circumventing of the security features of the Services or
                    any third party’s systems, networks or resources used in the provision of Services;
                </li>

                <li>
                    engaging in any attack, hack, denial-of-service attack, interference, or
                    exploit of any smart contract in connection with use of the Service
                    (and operations performed by a user that are technically permitted by a smart contract may nevertheless 
                    be a violation of our Agreement, including these Terms, and the law); or
                </li>

                <li>engaging in any anticompetitive behavior or other misconduct.</li>
            </ul>
            </TermsText>
            
            <TermsText bold>Violating our rules may result in our intervention.</TermsText>
            <TermsText>
                You agree and acknowledge that if you use the Services to engage in conduct prohibited by applicable law,
                permanently reserve the right to completely or partially restrict or revoke your access to the Services,
                either completely or for a period of time, at our sole discretion. We reserve the right to amend, rectify,
                edit, or otherwise alter transaction data to remediate or mitigate any damage caused either to us or to any
                other person as a result of a user’s violation of this Agreement or applicable law.
            </TermsText>

            <TermsText bold>We reserve the right to investigate violations.</TermsText>
            <TermsText>We reserve the right to investigate and prosecute any suspected breaches of this Agreement, including the Terms. We may disclose any information as necessary to satisfy any law, regulation, legal process, or governmental request.</TermsText>

            <TermsTitle space>Disclaimers and Limitations of Liability</TermsTitle>
            <TermsText bold>We make no representations or warranties.</TermsText>
            <TermsText>THE SERVICES ARE PROVIDED ON AN “AS IS” AND “AS AVAILABLE” BASIS. WE AND OUR PARENTS, SUBSIDIARIES, AFFILIATES, RELATED COMPANIES, OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, REPRESENTATIVES, PARTNERS, AND LICENSORS (COLLECTIVELY, THE “VOID MANAGEMENT LLC INDEMNIFIED PARTIES”) MAKE NO GUARANTEES OF ANY KIND IN CONNECTION WITH THE SERVICES. TO THE MAXIMUM EXTENT PERMITTED UNDER APPLICABLE LAW, THE VOID MANAGEMENT LLC INDEMNIFIED PARTIES DISCLAIM ALL WARRANTIES AND CONDITIONS, WHETHER EXPRESS OR IMPLIED, OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT AND DISCLAIM ALL RESPONSIBILITY AND LIABILITY FOR:</TermsText>
            <TermsText>
                <ul>
                    <li>THE SERVICES BEING ACCURATE, COMPLETE, CURRENT, RELIABLE, UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE. INFORMATION (INCLUDING, WITHOUT LIMITATION, THE VALUE OR OUTCOME OF ANY TRANSACTION) AVAILABLE THROUGH THE SERVICE IS PROVIDED FOR GENERAL INFORMATION ONLY AND SHOULD NOT BE RELIED UPON OR USED AS THE SOLE BASIS FOR MAKING DECISIONS. ANY RELIANCE ON THE SERVICES IS AT YOUR OWN RISK.</li>
                    <li>INJURY OR DAMAGE RESULTING FROM THE SERVICES. FOR EXAMPLE, YOU EXPRESSLY ACKNOWLEDGE, UNDERSTAND, AND AGREE THAT THE SERVICES MAY CONTAIN AUDIO-VISUAL EFFECTS, STROBE LIGHTS OR OTHER MATERIALS THAT MAY AFFECT YOUR PHYSICAL SENSES AND/OR PHYSICAL CONDITION. FURTHER, YOU EXPRESSLY ACKNOWLEDGE THAT THE VOID MANAGEMENT LLC INDEMNIFIED PARTIES ARE NOT RESPONSIBLE FOR LOSS OR DAMAGE CAUSED BY ANOTHER USER’S CONDUCT, UNAUTHORIZED ACTORS, OR ANY UNAUTHORIZED ACCESS TO OR USE OF THE SERVICES.</li>
                    <li>VIRUSES, WORMS, TROJAN HORSES, TIME BOMBS, CANCEL BOTS, SPIDERS, MALWARE OR OTHER TYPE OF MALICIOUS CODE THAT MAY BE USED IN ANY WAY TO AFFECT THE FUNCTIONALITY OR OPERATION OF THE SERVICES.</li>
                </ul>
            </TermsText>

            <TermsTitle space>Limitation of Liability.</TermsTitle>
            <TermsText>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL ANY VOID MANAGEMENT LLC BE LIABLE TO YOU FOR ANY LOSS, DAMAGE, OR INJURY OF ANY KIND INCLUDING ANY DIRECT, INDIRECT, SPECIAL, INCIDENTAL, EXEMPLARY, CONSEQUENTIAL, OR PUNITIVE LOSSES OR DAMAGES, OR DAMAGES FOR SYSTEM FAILURE OR MALFUNCTION OR LOSS OF PROFITS, DATA, USE, BUSINESS OR GOOD-WILL OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR IN CONNECTION WITH: (A) THE SERVICES OR YOUR INABILITY TO USE OR ACCESS THE SERVICES; (B) MISUSE OF THE SERVICES (INCLUDING WITHOUT LIMITATION, UNAUTHORIZED ACCESS OF THE SERVICES); (C) ANY USER CONDUCT ON THE SERVICES; OR (D) TERMINATION, SUSPENSION OR RESTRICTION OF ACCESS TO ANY THE SERVICES.
IN ADDITION TO THE FOREGOING, NO VOID MANAGEMENT LLC SHALL BE LIABLE FOR ANY DAMAGES CAUSED IN WHOLE OR IN PART BY: (A) USER ERROR, SUCH AS FORGOTTEN PASSWORDS OR INCORRECTLY CONSTRUCTED SMART CONTRACTS OR OTHER TRANSACTIONS; (B) SERVER FAILURE OR DATA LOSS; (C) THE MALFUNCTION, UNEXPECTED FUNCTION OR UNINTENDED FUNCTION OF THE BLOCKCHAIN, ANY COMPUTER OR CRYPTOASSET NETWORK (INCLUDING ANY WALLET PROVIDER), INCLUDING WITHOUT LIMITATION LOSSES ASSOCIATED WITH NETWORK FORKS, REPLAY ATTACKS, DOUBLE-SPEND ATTACKS, SYBIL ATTACKS, 51% ATTACKS, GOVERNANCE DISPUTES, MINING DIFFICULTY, CHANGES IN CRYPTOGRAPHY OR CONSENSUS RULES, HACKING, OR CYBERSECURITY BREACHES; (D) ANY CHANGE IN VALUE OF ANY CRYPTOASSET; (E) ANY CHANGE IN LAW, REGULATION, OR POLICY; (VI) EVENTS OF FORCE MAJEURE; OR (F) ANY THIRD PARTY.
THIS LIMITATION OF LIABILITY IS INTENDED TO APPLY WITHOUT REGARD TO WHETHER OTHER PROVISIONS OF THESE TERMS HAVE BEEN BREACHED OR HAVE PROVEN INEFFECTIVE. THE LIMITATIONS SET FORTH IN THIS SECTION SHALL APPLY REGARDLESS OF THE FORM OF ACTION, WHETHER THE ASSERTED LIABILITY OR DAMAGES ARE BASED ON CONTRACT, INDEMNIFICATION, TORT, STRICT LIABILITY, STATUTE, OR ANY OTHER LEGAL OR EQUITABLE THEORY, AND WHETHER OR NOT THE VOID MANAGEMENT LLC INDEMNIFIED PARTIES HAVE BEEN INFORMED OF THE POSSIBILITY OF ANY SUCH DAMAGE.
IN NO EVENT WILL THE VOID MANAGEMENT LLC INDEMNIFIED PARTIES’ CUMULATIVE LIABILITY TO YOU OR ANY OTHER USER, FROM ALL CAUSES OF ACTION AND ALL THEORIES OF LIABILITY EXCEED ONE HUNDRED U.S. DOLLARS (U.S. $100.00).
UNDER NO CIRCUMSTANCES SHALL ANY VOID MANAGEMENT LLC BE REQUIRED TO DELIVER TO YOU ANY VIRTUAL CURRENCY AS DAMAGES, MAKE SPECIFIC PERFORMANCE, OR ANY OTHER REMEDY. IF YOU WOULD BASE YOUR CALCULATIONS OF DAMAGES IN ANY WAY ON THE VALUE OF VIRTUAL CURRENCY, YOU AND WE AGREE THAT THE CALCULATION SHALL BE BASED ON THE LOWEST VALUE OF THE VIRTUAL CURRENCY DURING THE PERIOD BETWEEN THE ACCRUAL OF THE CLAIM AND THE AWARD OF DAMAGES.
            </TermsText>

            <TermsText>
                Some jurisdictions do not allow the exclusion or limitation of certain warranties and liabilities provided in this section; accordingly, some of the above limitations and disclaimers may not apply to you. To the extent applicable law does not permit Void Management LLC Indemnified Parties to disclaim certain warranties or limit certain liabilities, the extent of Void Management LLC Indemnified Parties’ liability and the scope of any such warranties will be as permitted under applicable law.
            </TermsText>

            <TermsTitle space>Indemnification</TermsTitle>
            <TermsText>You agree to indemnify, defend, and hold harmless the Void Management LLC Indemnified Parties from any claim or demand, including reasonable attorneys’ fees, made by any third party due to or arising out of: (a) your breach or alleged breach of the Agreement (including, without limitation, these Terms); (b) anything you contribute to the Services; (c) your misuse of the Services, or any smart contract and/or script related thereto; (d) your violation of any laws, rules, regulations, codes, statutes, ordinances, or orders of any governmental or quasi-governmental authorities; (e) your violation of the rights of any third party, including any intellectual property right, publicity, confidentiality, property, or privacy right; (f) your use of a third-party product, service, and/or website; or (g) any misrepresentation made by you. We reserve the right to assume, at your expense, the exclusive defense and control of any matter subject to indemnification by you. You agree to cooperate with our defense of any claim. You will not in any event settle any claim without our prior written consent.</TermsText>

            <TermsTitle space>Court Resolution Agreement and Waiver of Rights, Including Class Actions.</TermsTitle>
            <TermsText>PLEASE READ THIS SECTION CAREFULLY: IT MAY SIGNIFICANTLY AFFECT YOUR LEGAL RIGHTS, INCLUDING YOUR RIGHT TO FILE A LAWSUIT IN COURT. IT CONTAINS PROCEDURES FOR MANDATORY BINDING STATE COURT RESOLUTION AND A CLASS ACTION WAIVER.
Agreement to Attempt to Resolve Disputes Through Good Faith Negotiations
Prior to commencing any legal proceeding against us of any kind, including a Kazakhstan state court resolution as set forth below, you and we agree that we will attempt to resolve any dispute, claim, or controversy between us arising out of or relating to the agreement or the Services (each, a “Dispute” and, collectively, “Disputes”) by engaging in good faith negotiations. Such good faith negotiations require, at a minimum, that the aggrieved party provide a written notice to the other party specifying the nature and details of the Dispute. The party receiving such notice shall have thirty (30) days to respond to the notice. Within sixty (60) days after the aggrieved party sent the initial notice, the parties shall meet and confer in good faith by videoconference, or by telephone, to try to resolve the Dispute. If the parties are unable to resolve the Dispute within ninety (90) days after the aggrieved party sent the initial notice, the parties may agree to mediate their Dispute, or either party may submit the Dispute for the final resolution to the state courts of Kazakhstan at the location of Void Management LLC.</TermsText>

            <TermsText bold>Agreement to Court Resolution</TermsText>
            <TermsText>You and we agree that any Dispute that cannot be resolved through the procedures set forth above will be resolved through court resolution in accordance with the state court of the Kazakhstan Republic. The place of the resolution shall be the Kazakhstan Republic. The judge(s) shall have experience adjudicating matters involving Internet technology, software applications, financial transactions and, ideally, blockchain technology. The judge's award of damages must be consistent with the terms of the “Limitation of Liability” subsection of these Terms as to the types and amounts of damages for which a party may be held liable. The prevailing party will be entitled to an award of their reasonable attorney’s fees and costs. Except as may be required by law, neither a party nor its representatives may disclose the existence, content, or results of any court resolution hereunder without the prior written consent of (all/both) parties.
UNLESS YOU TIMELY PROVIDE US WITH A COURT OPT-OUT NOTICE (AS DEFINED BELOW IN THE SUBSECTION TITLED “YOUR CHOICES”), YOU ACKNOWLEDGE AND AGREE THAT YOU AND WE ARE EACH WAIVING THE RIGHT TO A TRIAL BY JURY OR TO PARTICIPATE AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS ACTION OR REPRESENTATIVE PROCEEDING. FURTHER, UNLESS BOTH YOU AND WE OTHERWISE AGREE IN WRITING, THE COURT MAY NOT CONSOLIDATE MORE THAN ONE PERSON’S CLAIMS AND MAY NOT OTHERWISE PRESIDE OVER ANY FORM OF ANY CLASS OR REPRESENTATIVE PROCEEDING.</TermsText>

            <TermsTitle space>Changes</TermsTitle>
            <TermsText>By rejecting any changes to these Terms, you agree that you will arbitrate any Dispute between you and us in accordance with the provisions of this section as of the date you first accepted these Terms (or accepted any subsequent changes to these Terms).</TermsText>

            <TermsTitle space>Waiver of Injunctive or Other Equitable Relief.</TermsTitle>
            <TermsText>O THE MAXIMUM EXTENT PERMITTED BY LAW, YOU AGREE THAT YOU WILL NOT BE PERMITTED TO OBTAIN AN INJUNCTION OR OTHER EQUITABLE RELIEF OF ANY KIND, SUCH AS ANY COURT OR OTHER ACTION THAT MAY INTERFERE WITH OR PREVENT THE DEVELOPMENT OR EXPLOITATION OF THE SERVICES, OR ANY OTHER WEBSITE, APPLICATION, CONTENT, SUBMISSION, PRODUCT, SERVICE, OR INTELLECTUAL PROPERTY OWNED, LICENSED, USED OR CONTROLLED BY ANY VOID MANAGEMENT LLC.</TermsText>

            <TermsTitle space>Termination; Cancellation</TermsTitle>
            <TermsText>This Agreement is effective unless and until terminated by either you or us. You may terminate your Agreement with us at any time by ceasing all access to the Site or the Services. If, in our sole judgment, you fail, or we suspect that you have failed, to comply with any term or provision of the Agreement (including without limitation any provision of these Terms), we reserve the right to terminate our Agreement with you and deny you access to the Services. We further reserve the right to restrict your access to the Site or to stop providing you with all or a part of the Services at any time and for no reason, including, without limitation, if we reasonably believe: (a) your use of the Services exposes us to risk or liability; (b) you are using the Services for unlawful purposes; or (c) it is not commercially viable to continue providing you with our Services. All of these are in addition to any other rights and remedies that may be available to us, whether in equity or at law, all of which we expressly reserve. WE RESERVE THE RIGHT TO MODIFY THE SERVICES AT ANY TIME, BUT WE HAVE NO OBLIGATION TO UPDATE THE SERVICES. YOU AGREE THAT IT IS YOUR RESPONSIBILITY TO MONITOR CHANGES TO THE SERVICES THAT MAY AFFECT YOU. YOU AGREE THAT WE MAY REMOVE THE SERVICES AND/OR ANY CONTENT THEREON FOR INDEFINITE PERIODS OF TIME OR CANCEL THE SERVICES AT ANY TIME, WITHOUT NOTICE TO YOU.</TermsText>

            <TermsTitle space>Severability</TermsTitle>
            <TermsText>If any provision of the Agreement (including, without limitation, these Terms) is determined to be unlawful, void, or unenforceable, such provision shall nonetheless be enforceable to the fullest extent permitted by applicable law, and the unenforceable portion shall be deemed to be severed from the Agreement. Such determination shall not affect the validity and enforceability of any other remaining provisions.</TermsText>

            <TermsTitle space>Assignment</TermsTitle>
            <TermsText>The Agreement (including, without limitation, these Terms) may be assigned without your prior consent to any Void Management LLC, or to its successors in the interest of any business associated with the Services provided by us. You may not assign or transfer any rights or obligations under the Agreement without our prior written consent.</TermsText>

            <TermsTitle>Entire Agreement</TermsTitle>
            <TermsText>The Agreement (including, without limitation, these Terms) and any policies or operating rules posted by us on the Services constitute the entire agreement and understanding between you and us and govern your use of the Services, superseding any prior or contemporaneous agreements, communications, and proposals, whether oral or written, between you and us (including, but not limited to, any prior versions of these Terms). Any failure by us to exercise or enforce any right or provision of the Agreement (including, without limitation, these Terms) shall not constitute a waiver of such right or provision.</TermsText>

            <TermsTitle>Governing Law</TermsTitle>
            <TermsText>These Terms and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of the Kazakhstan Republic.</TermsText>

        </Col>
    });
}


export function UserAgreement(props){
    if(!localStorage.hasSigned){
        userAgreementModal();
    }

    return <Typography.Text style={props.style} onClick={userAgreementModal}>User agreement</Typography.Text>;
}
