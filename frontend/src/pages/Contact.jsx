function Contact() {
    return (
        <section className="min-h-screen bg-gray-50 px-6 py-20">
            <div className="mx-auto max-w-4xl text-center">
                <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
                    Contact Us
                </p>
                <h1 className="mt-3 text-4xl font-bold text-gray-900">
                    We'd love to hear from you.
                </h1>
                <p className="mx-auto mt-6 max-w-2xl leading-7 text-gray-600">  
                    Have questions or feedback? Reach out to us!
                </p>
            </div>


            <div className="mx-auto mt-12 max-w-2xl">
                <form className="space-y-6">
                    <div>
                        <label
                            htmlFor="name"  
                            className="block text-sm font-medium text-gray-700"
                        >
                            Name
                        </label>        
                        <input
                            type="text"
                            id="name"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm"
                            placeholder="Your Name"
                        />
                    </div>  

                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700" 

                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm"
                            placeholder="Your Email"
                        />
                    </div>  
                    <div>
                        <label
                            htmlFor="message"   
                            className="block text-sm font-medium text-gray-700"
                        >
                            Message
                        </label>    
                        <textarea
                            id="message"
                            rows="4"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm"         
                    placeholder="Your Message"
                        ></textarea>
                    </div>  
                    <button
                        type="submit"
                        className="w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
                    >   
                        Send Message
                    </button>
                </form>
            </div>
        </section>
    );
}
        

export default Contact;